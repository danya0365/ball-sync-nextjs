import { ISourcesRepository, SourcesViewModel } from "@/src/presentation/presenters/sources/ISourcesRepository";
import { ISyncLogRepository } from "@/src/application/repositories/ISyncLogRepository";
import { IExternalFootballApi } from "@/src/application/repositories/IExternalFootballApi";
import { SyncFootballDataUseCase } from "@/src/application/use-cases/SyncFootballDataUseCase";

export class ServerSourcesRepository implements ISourcesRepository {
  constructor(
    private readonly syncLogRepository: ISyncLogRepository,
    private readonly syncUseCase: SyncFootballDataUseCase,
    private readonly sourcesApi: IExternalFootballApi[]
  ) {}

  async getViewModelData(): Promise<SourcesViewModel> {
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
    return { logs: paginatedLogs.data, sources };
  }

  async triggerSync(sourceName: string): Promise<void> {
    await this.syncUseCase.execute(sourceName, 'manual');
  }
}
