import { IExternalFootballService, NormalizedMatch } from "@/src/application/services/IExternalFootballService";
import { ISyncLogRepository } from "@/src/application/repositories/ISyncLogRepository";
import { ISourceMatchRepository } from "@/src/application/repositories/ISourceMatchRepository";
import { IUnifiedMatchRepository, UnifiedMatch } from "@/src/application/repositories/IUnifiedMatchRepository";
import { IMatchMappingRepository } from "@/src/application/repositories/IMatchMappingRepository";
import { ISyncFootballDataUseCase } from "./ISyncFootballDataUseCase";

export class SyncFootballDataUseCase implements ISyncFootballDataUseCase {
  constructor(
    private readonly sources: IExternalFootballService[],
    private readonly syncLogRepository: ISyncLogRepository,
    private readonly sourceMatchRepository: ISourceMatchRepository,
    private readonly unifiedMatchRepository: IUnifiedMatchRepository,
    private readonly matchMappingRepository: IMatchMappingRepository
  ) {}

  async execute(sourceName: string = 'all', triggeredBy: 'cron' | 'manual' = 'manual') {
    const results = [];
    const targetSources = sourceName === 'all' 
      ? this.sources 
      : this.sources.filter(s => s.getSourceName() === sourceName);

    if (targetSources.length === 0) {
      throw new Error(`Source ${sourceName} not found`);
    }

    for (const source of targetSources) {
      const startTime = Date.now();
      try {
        // 1. Fetch from external API
        const matches = await source.fetchLiveMatches();
        
        // 2. Aggregate each match
        for (const match of matches) {
          await this.aggregateMatch(match);
        }

        const recordsProcessed = matches.length;

        // 3. Log success
        const durationMs = Date.now() - startTime;
        const log = await this.syncLogRepository.create({
          sourceName: source.getSourceName(),
          status: 'success',
          recordsProcessed,
          durationMs,
          triggeredBy
        });
        
        results.push(log);
      } catch (error: any) {
        // Log failure
        const durationMs = Date.now() - startTime;
        const log = await this.syncLogRepository.create({
          sourceName: source.getSourceName(),
          status: 'failed',
          recordsProcessed: 0,
          errorMessage: error.message || 'Unknown error',
          durationMs,
          triggeredBy
        });
        
        results.push(log);
        console.error(`[SyncError] ${source.getSourceName()}:`, error);
      }
    }

    return results;
  }

  /**
   * Performs the aggregation logic for a single source match
   */
  private async aggregateMatch(match: NormalizedMatch) {
    // 1. Resolve Entity: Find if we already know this match
    let unifiedId = await this.matchMappingRepository.findUnifiedId(match.sourceName, match.externalId);

    if (unifiedId) {
      // Update existing unified record
      await this.unifiedMatchRepository.upsert({
        id: unifiedId,
        status: match.status,
        score: match.score,
        lastUpdatedBySource: match.sourceName,
      });
    } else {
      // Check Auto-Mapping by searching DB for matches around the same timestamp (+/- 24h)
      // Note: For simplicity on the client side without complex date math, we query the exact day string.
      // E.g. 2026-04-12T00:00:00Z -> we can slice to YYYY-MM-DD
      const dateOnly = match.matchDate.split('T')[0];
      const startDate = `${dateOnly}T00:00:00.000Z`;
      const endDate = `${dateOnly}T23:59:59.999Z`;
      const existingMatchesResult = await this.unifiedMatchRepository.query({
        dateRange: { startDate, endDate },
        pagination: { limit: 1000 }
      });
      const possibleMatches = existingMatchesResult.data;

      // We use dynamic import for the utility to ensure it works nicely in client & server
      const { calculateSimilarity } = await import('@/src/infrastructure/utils/stringSimilarity');

      let bestMatch: UnifiedMatch | null = null;
      let highestSimilarity = 0;

      for (const pMatch of possibleMatches) {
        const homeSim = calculateSimilarity(match.homeTeam, pMatch.homeTeamNameEn);
        const awaySim = calculateSimilarity(match.awayTeam, pMatch.awayTeamNameEn);
        const avgSim = (homeSim + awaySim) / 2;

        if (avgSim > highestSimilarity) {
          highestSimilarity = avgSim;
          bestMatch = pMatch;
        }
      }

      // Threshold: 80% similarity threshold to auto-map
      if (bestMatch && highestSimilarity >= 0.8) {
        unifiedId = bestMatch.id;
        
        // Auto-Map found! Update the existing
        await this.unifiedMatchRepository.upsert({
          id: unifiedId,
          status: match.status,
          score: match.score,
          lastUpdatedBySource: match.sourceName,
        });

      } else {
        // No match found. Create new Unified Record.
        const isTrusted = match.sourceName === 'football-data.org';
        
        const unifiedMatch = await this.unifiedMatchRepository.upsert({
          homeTeamNameEn: match.homeTeam,
          awayTeamNameEn: match.awayTeam,
          matchDate: match.matchDate,
          status: match.status,
          score: match.score,
          lastUpdatedBySource: match.sourceName,
          isApproved: isTrusted,
        });
        
        unifiedId = unifiedMatch.id;
      }
      
      // Create Mapping
      await this.matchMappingRepository.createMapping(match.sourceName, match.externalId, unifiedId);
    }

    // 2. Preserves Source Data
    await this.sourceMatchRepository.upsert(match, unifiedId);
  }
}
