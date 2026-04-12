"use client";

import { ExplorerPresenter } from "./ExplorerPresenter";
import { ApiUnifiedMatchRepository } from "@/src/infrastructure/repositories/api/ApiUnifiedMatchRepository";
import { ApiSourceMatchRepository } from "@/src/infrastructure/repositories/api/ApiSourceMatchRepository";
import { ApiUnifiedTeamRepository } from "@/src/infrastructure/repositories/api/ApiUnifiedTeamRepository";
import { ApiSourceTeamRepository } from "@/src/infrastructure/repositories/api/ApiSourceTeamRepository";
import { ApiUnifiedLeagueRepository } from "@/src/infrastructure/repositories/api/ApiUnifiedLeagueRepository";
import { ApiSourceLeagueRepository } from "@/src/infrastructure/repositories/api/ApiSourceLeagueRepository";
import { ApiUnifiedPlayerRepository } from "@/src/infrastructure/repositories/api/ApiUnifiedPlayerRepository";
import { ApiSourcePlayerRepository } from "@/src/infrastructure/repositories/api/ApiSourcePlayerRepository";

export class ExplorerPresenterClientFactory {
  static create(): ExplorerPresenter {
    return new ExplorerPresenter(
      new ApiUnifiedMatchRepository(),
      new ApiSourceMatchRepository(),
      new ApiUnifiedTeamRepository(),
      new ApiSourceTeamRepository(),
      new ApiUnifiedLeagueRepository(),
      new ApiSourceLeagueRepository(),
      new ApiUnifiedPlayerRepository(),
      new ApiSourcePlayerRepository(),
    );
  }
}

export function createClientExplorerPresenter(): ExplorerPresenter {
  return ExplorerPresenterClientFactory.create();
}
