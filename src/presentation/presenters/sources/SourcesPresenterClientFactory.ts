"use client";

import { SyncFootballDataUseCase } from "@/src/application/use-cases/SyncFootballDataUseCase";
import { ApiSyncLogRepository } from "@/src/infrastructure/repositories/api/ApiSyncLogRepository";
import { ApiSourceMatchRepository } from "@/src/infrastructure/repositories/api/ApiSourceMatchRepository";
import { ApiUnifiedMatchRepository } from "@/src/infrastructure/repositories/api/ApiUnifiedMatchRepository";
import { ApiMatchMappingRepository } from "@/src/infrastructure/repositories/api/ApiMatchMappingRepository";
import { ApiExternalFootballService } from "@/src/infrastructure/services/api/ApiExternalFootballService";
import { SourcesPresenter } from "./SourcesPresenter";

export class SourcesPresenterClientFactory {
  static create(): SourcesPresenter {
    const sources = [
      new ApiExternalFootballService("football-data.org"),
      new ApiExternalFootballService("thesportsdb.com")
    ];
    
    const logRepo = new ApiSyncLogRepository();
    const sourceMatchRepo = new ApiSourceMatchRepository();
    const unifiedMatchRepo = new ApiUnifiedMatchRepository();
    const matchMappingRepo = new ApiMatchMappingRepository();
    
    const syncUseCase = new SyncFootballDataUseCase(
      sources, 
      logRepo,
      sourceMatchRepo,
      unifiedMatchRepo,
      matchMappingRepo
    );
    
    return new SourcesPresenter(logRepo, sources, syncUseCase);
  }
}

export function createClientSourcesPresenter(): SourcesPresenter {
  return SourcesPresenterClientFactory.create();
}
