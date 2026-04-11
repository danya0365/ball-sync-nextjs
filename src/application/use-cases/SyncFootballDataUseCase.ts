import { IExternalFootballService } from "@/src/application/services/IExternalFootballService";
import { ISyncLogRepository } from "@/src/application/repositories/ISyncLogRepository";
import { ISyncFootballDataUseCase } from "./ISyncFootballDataUseCase";

export class SyncFootballDataUseCase implements ISyncFootballDataUseCase {
  constructor(
    private readonly sources: IExternalFootballService[],
    private readonly syncLogRepository: ISyncLogRepository
  ) {}

  /**
   * Execute synchronization from a specific source
   * @param sourceName name of the source or 'all'
   * @param triggeredBy 'cron' | 'manual'
   */
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
        
        // 2. Normalize and Map (In real logic, we would upsert to DB here)
        // e.g. await matchRepository.upsertMany(matches)
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
}
