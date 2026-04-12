"use client";

import { SyncFootballDataUseCase } from "@/src/application/use-cases/SyncFootballDataUseCase";
import { ApiSyncLogRepository } from "@/src/infrastructure/repositories/api/ApiSyncLogRepository";
import { ApiSourceMatchRepository } from "@/src/infrastructure/repositories/api/ApiSourceMatchRepository";
import { ApiUnifiedMatchRepository } from "@/src/infrastructure/repositories/api/ApiUnifiedMatchRepository";
import { ApiMatchMappingRepository } from "@/src/infrastructure/repositories/api/ApiMatchMappingRepository";
import { ApiSourceTeamRepository } from "@/src/infrastructure/repositories/api/ApiSourceTeamRepository";
import { ApiUnifiedTeamRepository } from "@/src/infrastructure/repositories/api/ApiUnifiedTeamRepository";
import { ApiTeamMappingRepository } from "@/src/infrastructure/repositories/api/ApiTeamMappingRepository";
import { ApiSourceLeagueRepository } from "@/src/infrastructure/repositories/api/ApiSourceLeagueRepository";
import { ApiUnifiedLeagueRepository } from "@/src/infrastructure/repositories/api/ApiUnifiedLeagueRepository";
import { ApiLeagueMappingRepository } from "@/src/infrastructure/repositories/api/ApiLeagueMappingRepository";
import { ApiSourcePlayerRepository } from "@/src/infrastructure/repositories/api/ApiSourcePlayerRepository";
import { ApiUnifiedPlayerRepository } from "@/src/infrastructure/repositories/api/ApiUnifiedPlayerRepository";
import { ApiPlayerMappingRepository } from "@/src/infrastructure/repositories/api/ApiPlayerMappingRepository";
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
    
    const sourceTeamRepo = new ApiSourceTeamRepository();
    const unifiedTeamRepo = new ApiUnifiedTeamRepository();
    const teamMappingRepo = new ApiTeamMappingRepository();
    
    const sourceLeagueRepo = new ApiSourceLeagueRepository();
    const unifiedLeagueRepo = new ApiUnifiedLeagueRepository();
    const leagueMappingRepo = new ApiLeagueMappingRepository();
    
    const sourcePlayerRepo = new ApiSourcePlayerRepository();
    const unifiedPlayerRepo = new ApiUnifiedPlayerRepository();
    const playerMappingRepo = new ApiPlayerMappingRepository();
    
    const syncUseCase = new SyncFootballDataUseCase(
      sources, 
      logRepo,
      sourceMatchRepo,
      unifiedMatchRepo,
      matchMappingRepo,
      sourceTeamRepo,
      unifiedTeamRepo,
      teamMappingRepo,
      sourceLeagueRepo,
      unifiedLeagueRepo,
      leagueMappingRepo,
      sourcePlayerRepo,
      unifiedPlayerRepo,
      playerMappingRepo
    );
    
    return new SourcesPresenter(logRepo, sources, syncUseCase);
  }
}

export function createClientSourcesPresenter(): SourcesPresenter {
  return SourcesPresenterClientFactory.create();
}
