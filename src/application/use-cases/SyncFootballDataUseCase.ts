import { IExternalFootballService, NormalizedMatch, NormalizedTeam, NormalizedLeague, NormalizedPlayer } from "@/src/application/services/IExternalFootballService";
import { ISyncLogRepository } from "@/src/application/repositories/ISyncLogRepository";
import { ISourceMatchRepository } from "@/src/application/repositories/ISourceMatchRepository";
import { IUnifiedMatchRepository, UnifiedMatch } from "@/src/application/repositories/IUnifiedMatchRepository";
import { IMatchMappingRepository } from "@/src/application/repositories/IMatchMappingRepository";
import { ISourceTeamRepository } from "@/src/application/repositories/ISourceTeamRepository";
import { IUnifiedTeamRepository, UnifiedTeam } from "@/src/application/repositories/IUnifiedTeamRepository";
import { ITeamMappingRepository } from "@/src/application/repositories/ITeamMappingRepository";
import { ISourceLeagueRepository } from "@/src/application/repositories/ISourceLeagueRepository";
import { IUnifiedLeagueRepository, UnifiedLeague } from "@/src/application/repositories/IUnifiedLeagueRepository";
import { ILeagueMappingRepository } from "@/src/application/repositories/ILeagueMappingRepository";
import { ISourcePlayerRepository } from "@/src/application/repositories/ISourcePlayerRepository";
import { IUnifiedPlayerRepository, UnifiedPlayer } from "@/src/application/repositories/IUnifiedPlayerRepository";
import { IPlayerMappingRepository } from "@/src/application/repositories/IPlayerMappingRepository";
import { ISyncFootballDataUseCase } from "./ISyncFootballDataUseCase";

export type SyncDomain = 'matches' | 'teams' | 'leagues' | 'players' | 'all';

export interface SyncConfig {
  trigger: 'cron' | 'manual';
  domain: SyncDomain;
}

export class SyncFootballDataUseCase implements ISyncFootballDataUseCase {
  constructor(
    private readonly sources: IExternalFootballService[],
    private readonly syncLogRepository: ISyncLogRepository,
    private readonly sourceMatchRepository: ISourceMatchRepository,
    private readonly unifiedMatchRepository: IUnifiedMatchRepository,
    private readonly matchMappingRepository: IMatchMappingRepository,
    // Team repos
    private readonly sourceTeamRepository?: ISourceTeamRepository,
    private readonly unifiedTeamRepository?: IUnifiedTeamRepository,
    private readonly teamMappingRepository?: ITeamMappingRepository,
    // League repos
    private readonly sourceLeagueRepository?: ISourceLeagueRepository,
    private readonly unifiedLeagueRepository?: IUnifiedLeagueRepository,
    private readonly leagueMappingRepository?: ILeagueMappingRepository,
    // Player repos
    private readonly sourcePlayerRepository?: ISourcePlayerRepository,
    private readonly unifiedPlayerRepository?: IUnifiedPlayerRepository,
    private readonly playerMappingRepository?: IPlayerMappingRepository
  ) {}

  async execute(sourceName: string = 'all', triggeredBy: 'cron' | 'manual' = 'manual', domain: SyncDomain = 'all') {
    const results = [];
    const targetSources = sourceName === 'all' 
      ? this.sources 
      : this.sources.filter(s => s.getSourceName() === sourceName);

    if (targetSources.length === 0) {
      throw new Error(`Source ${sourceName} not found`);
    }

    const domains = domain === 'all' 
      ? ['matches', 'leagues', 'teams', 'players'] as const
      : [domain] as const;

    for (const source of targetSources) {
      for (const dom of domains) {
        const startTime = Date.now();
        try {
          let recordsProcessed = 0;

          switch (dom) {
            case 'matches':
              recordsProcessed = await this.syncMatches(source);
              break;
            case 'leagues':
              recordsProcessed = await this.syncLeagues(source);
              break;
            case 'teams':
              recordsProcessed = await this.syncTeams(source);
              break;
            case 'players':
              recordsProcessed = await this.syncPlayers(source);
              break;
          }

          const durationMs = Date.now() - startTime;
          const log = await this.syncLogRepository.create({
            sourceName: `${source.getSourceName()}:${dom}`,
            status: 'success',
            recordsProcessed,
            durationMs,
            triggeredBy
          });
          
          results.push(log);
        } catch (error: any) {
          const durationMs = Date.now() - startTime;
          const log = await this.syncLogRepository.create({
            sourceName: `${source.getSourceName()}:${dom}`,
            status: 'failed',
            recordsProcessed: 0,
            errorMessage: error.message || 'Unknown error',
            durationMs,
            triggeredBy
          });
          
          results.push(log);
          console.error(`[SyncError] ${source.getSourceName()}:${dom}:`, error);
        }
      }
    }

    return results;
  }

  // ============================================================
  // MATCHES
  // ============================================================

  private async syncMatches(source: IExternalFootballService): Promise<number> {
    const matches = await source.fetchLiveMatches();
    for (const match of matches) {
      await this.aggregateMatch(match);
    }
    return matches.length;
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
      const dateOnly = match.matchDate.split('T')[0];
      const startDate = `${dateOnly}T00:00:00.000Z`;
      const endDate = `${dateOnly}T23:59:59.999Z`;
      const existingMatchesResult = await this.unifiedMatchRepository.query({
        dateRange: { startDate, endDate },
        pagination: { limit: 1000 }
      });
      const possibleMatches = existingMatchesResult.data;

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
        
        await this.unifiedMatchRepository.upsert({
          id: unifiedId,
          status: match.status,
          score: match.score,
          lastUpdatedBySource: match.sourceName,
        });

      } else {
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

  // ============================================================
  // LEAGUES
  // ============================================================

  private async syncLeagues(source: IExternalFootballService): Promise<number> {
    if (!this.sourceLeagueRepository || !this.unifiedLeagueRepository || !this.leagueMappingRepository) {
      console.warn(`[Sync] League repos not injected. Skipping league sync.`);
      return 0;
    }

    const leagues = await source.fetchLeagues();
    for (const league of leagues) {
      await this.aggregateLeague(league);
    }
    return leagues.length;
  }

  private async aggregateLeague(league: NormalizedLeague) {
    if (!this.sourceLeagueRepository || !this.unifiedLeagueRepository || !this.leagueMappingRepository) return;

    let unifiedId = await this.leagueMappingRepository.findUnifiedId(league.sourceName, league.externalId);

    if (unifiedId) {
      await this.unifiedLeagueRepository.upsert({
        id: unifiedId,
        currentSeason: league.currentSeason,
        emblemUrl: league.emblemUrl,
        lastUpdatedBySource: league.sourceName,
      });
    } else {
      // Auto-map by name similarity
      const existingResult = await this.unifiedLeagueRepository.query({ pagination: { limit: 1000 } });
      const { calculateSimilarity } = await import('@/src/infrastructure/utils/stringSimilarity');

      let bestMatch: UnifiedLeague | null = null;
      let highestSimilarity = 0;

      for (const existing of existingResult.data) {
        const sim = calculateSimilarity(league.name, existing.nameEn);
        if (sim > highestSimilarity) {
          highestSimilarity = sim;
          bestMatch = existing;
        }
      }

      if (bestMatch && highestSimilarity >= 0.85) {
        unifiedId = bestMatch.id;
        await this.unifiedLeagueRepository.upsert({
          id: unifiedId,
          currentSeason: league.currentSeason,
          emblemUrl: league.emblemUrl,
          lastUpdatedBySource: league.sourceName,
        });
      } else {
        const isTrusted = league.sourceName === 'football-data.org';
        const unified = await this.unifiedLeagueRepository.upsert({
          nameEn: league.name,
          code: league.code,
          country: league.country,
          emblemUrl: league.emblemUrl,
          type: league.type || 'LEAGUE',
          currentSeason: league.currentSeason,
          lastUpdatedBySource: league.sourceName,
          isApproved: isTrusted,
        });
        unifiedId = unified.id;
      }

      await this.leagueMappingRepository.createMapping(league.sourceName, league.externalId, unifiedId);
    }

    await this.sourceLeagueRepository.upsert(league, unifiedId);
  }

  // ============================================================
  // TEAMS
  // ============================================================

  private async syncTeams(source: IExternalFootballService): Promise<number> {
    if (!this.sourceTeamRepository || !this.unifiedTeamRepository || !this.teamMappingRepository) {
      console.warn(`[Sync] Team repos not injected. Skipping team sync.`);
      return 0;
    }

    const teams = await source.fetchTeams();
    for (const team of teams) {
      await this.aggregateTeam(team);
    }
    return teams.length;
  }

  private async aggregateTeam(team: NormalizedTeam) {
    if (!this.sourceTeamRepository || !this.unifiedTeamRepository || !this.teamMappingRepository) return;

    let unifiedId = await this.teamMappingRepository.findUnifiedId(team.sourceName, team.externalId);

    if (unifiedId) {
      await this.unifiedTeamRepository.upsert({
        id: unifiedId,
        crestUrl: team.crestUrl,
        venueName: team.venueName,
        website: team.website,
        lastUpdatedBySource: team.sourceName,
      });
    } else {
      // Auto-map by name similarity
      const existingResult = await this.unifiedTeamRepository.query({ pagination: { limit: 2000 } });
      const { calculateSimilarity } = await import('@/src/infrastructure/utils/stringSimilarity');

      let bestMatch: UnifiedTeam | null = null;
      let highestSimilarity = 0;

      for (const existing of existingResult.data) {
        const sim = calculateSimilarity(team.name, existing.nameEn);
        if (sim > highestSimilarity) {
          highestSimilarity = sim;
          bestMatch = existing;
        }
      }

      if (bestMatch && highestSimilarity >= 0.8) {
        unifiedId = bestMatch.id;
        await this.unifiedTeamRepository.upsert({
          id: unifiedId,
          crestUrl: team.crestUrl,
          venueName: team.venueName,
          website: team.website,
          lastUpdatedBySource: team.sourceName,
        });
      } else {
        const isTrusted = team.sourceName === 'football-data.org';
        const unified = await this.unifiedTeamRepository.upsert({
          nameEn: team.name,
          shortName: team.shortName,
          tla: team.tla,
          country: team.country,
          crestUrl: team.crestUrl,
          foundedYear: team.foundedYear,
          venueName: team.venueName,
          website: team.website,
          lastUpdatedBySource: team.sourceName,
          isApproved: isTrusted,
        });
        unifiedId = unified.id;
      }

      await this.teamMappingRepository.createMapping(team.sourceName, team.externalId, unifiedId);
    }

    await this.sourceTeamRepository.upsert(team, unifiedId);
  }

  // ============================================================
  // PLAYERS
  // ============================================================

  private async syncPlayers(source: IExternalFootballService): Promise<number> {
    if (!this.sourcePlayerRepository || !this.unifiedPlayerRepository || !this.playerMappingRepository) {
      console.warn(`[Sync] Player repos not injected. Skipping player sync.`);
      return 0;
    }

    const players = await source.fetchPlayers();
    for (const player of players) {
      await this.aggregatePlayer(player);
    }
    return players.length;
  }

  private async aggregatePlayer(player: NormalizedPlayer) {
    if (!this.sourcePlayerRepository || !this.unifiedPlayerRepository || !this.playerMappingRepository) return;

    let unifiedId = await this.playerMappingRepository.findUnifiedId(player.sourceName, player.externalId);

    if (unifiedId) {
      await this.unifiedPlayerRepository.upsert({
        id: unifiedId,
        photoUrl: player.photoUrl,
        shirtNumber: player.shirtNumber,
        lastUpdatedBySource: player.sourceName,
      });
    } else {
      const isTrusted = player.sourceName === 'football-data.org';
      const unified = await this.unifiedPlayerRepository.upsert({
        nameEn: player.name,
        nationality: player.nationality,
        position: player.position,
        dateOfBirth: player.dateOfBirth,
        shirtNumber: player.shirtNumber,
        photoUrl: player.photoUrl,
        lastUpdatedBySource: player.sourceName,
        isApproved: isTrusted,
      });
      unifiedId = unified.id;

      await this.playerMappingRepository.createMapping(player.sourceName, player.externalId, unifiedId);
    }

    await this.sourcePlayerRepository.upsert(player, unifiedId);
  }
}
