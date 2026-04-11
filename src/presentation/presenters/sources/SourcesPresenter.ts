import { ISyncLogRepository, SyncLog } from "@/src/application/repositories/ISyncLogRepository";
import { IExternalFootballService } from "@/src/application/services/IExternalFootballService";
import { ISyncFootballDataUseCase } from "@/src/application/use-cases/ISyncFootballDataUseCase";

export interface SourceStatus {
  name: string;
  isOnline: boolean;
  pingMs: number;
}

export interface SourcesViewModel {
  logs: SyncLog[];
  sources: SourceStatus[];
}

export class SourcesPresenter {
  constructor(
    private readonly syncLogRepository: ISyncLogRepository,
    private readonly sourcesApi: IExternalFootballService[],
    private readonly syncUseCase: ISyncFootballDataUseCase
  ) {}

  async getViewModel(): Promise<SourcesViewModel> {
    const paginatedLogs = await this.syncLogRepository.getPaginated(1, 10);
    const sourceStatusPromises = this.sourcesApi.map(async (api) => {
      const start = Date.now();
      let isOnline = false;
      try {
        isOnline = await api.ping();
      } catch {
        isOnline = false;
      }
      return {
        name: api.getSourceName(),
        isOnline,
        pingMs: Date.now() - start
      };
    });

    const sources = await Promise.all(sourceStatusPromises);

    return {
      logs: paginatedLogs.data,
      sources
    };
  }

  async triggerManualSync(sourceName: string = 'all'): Promise<void> {
    await this.syncUseCase.execute(sourceName, 'manual');
  }
}
