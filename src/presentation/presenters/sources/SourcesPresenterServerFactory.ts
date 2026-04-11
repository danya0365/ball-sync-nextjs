import { SyncFootballDataUseCase } from "@/src/application/use-cases/SyncFootballDataUseCase";
import { MockSyncLogRepository } from "@/src/infrastructure/repositories/mock/MockSyncLogRepository";
import { FootballDataOrgService } from "@/src/infrastructure/services/FootballDataOrgService";
import { TheSportsDbService } from "@/src/infrastructure/services/TheSportsDbService";
import { SourcesPresenter } from "./SourcesPresenter";

export class SourcesPresenterServerFactory {
  static create(): SourcesPresenter {
    const sources = [
      new FootballDataOrgService(),
      new TheSportsDbService()
    ];
    
    // Next step: use SupabaseSyncLogRepository here
    const logRepo = new MockSyncLogRepository();
    const useCase = new SyncFootballDataUseCase(sources, logRepo);
    
    return new SourcesPresenter(logRepo, sources, useCase);
  }
}

export function createServerSourcesPresenter(): SourcesPresenter {
  return SourcesPresenterServerFactory.create();
}
