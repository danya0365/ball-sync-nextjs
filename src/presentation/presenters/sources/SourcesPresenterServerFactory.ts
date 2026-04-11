import { SourcesPresenter } from "./SourcesPresenter";
import { ServerSourcesRepository } from "@/src/infrastructure/repositories/server/ServerSourcesRepository";
import { MockSyncLogRepository } from "@/src/infrastructure/repositories/mock/MockSyncLogRepository";
import { FootballDataOrgRepository } from "@/src/infrastructure/repositories/api/FootballDataOrgRepository";
import { TheSportsDbRepository } from "@/src/infrastructure/repositories/api/TheSportsDbRepository";
import { SyncFootballDataUseCase } from "@/src/application/use-cases/SyncFootballDataUseCase";

export class SourcesPresenterServerFactory {
  static create(): SourcesPresenter {
    const sources = [
      new FootballDataOrgRepository(),
      new TheSportsDbRepository()
    ];
    const logRepo = new MockSyncLogRepository();
    const useCase = new SyncFootballDataUseCase(sources, logRepo);
    
    // Instantiate Server Repository (contains complex logic avoiding browser execution)
    const repository = new ServerSourcesRepository(logRepo, useCase, sources);
    
    return new SourcesPresenter(repository);
  }
}

export function createServerSourcesPresenter(): SourcesPresenter {
  return SourcesPresenterServerFactory.create();
}
