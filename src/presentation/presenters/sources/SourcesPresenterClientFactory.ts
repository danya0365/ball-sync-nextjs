"use client";

import { SyncFootballDataUseCase } from "@/src/application/use-cases/SyncFootballDataUseCase";
import { ApiSyncLogRepository } from "@/src/infrastructure/repositories/api/ApiSyncLogRepository";
import { ApiExternalFootballService } from "@/src/infrastructure/services/api/ApiExternalFootballService";
import { SourcesPresenter } from "./SourcesPresenter";

export class SourcesPresenterClientFactory {
  static create(): SourcesPresenter {
    const sources = [
      new ApiExternalFootballService("football-data.org"),
      new ApiExternalFootballService("thesportsdb.com")
    ];
    
    const logRepo = new ApiSyncLogRepository();
    const syncUseCase = new SyncFootballDataUseCase(sources, logRepo);
    
    return new SourcesPresenter(logRepo, sources, syncUseCase);
  }
}

export function createClientSourcesPresenter(): SourcesPresenter {
  return SourcesPresenterClientFactory.create();
}
