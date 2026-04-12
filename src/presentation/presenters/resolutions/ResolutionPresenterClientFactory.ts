"use client";

import { ResolutionPresenter } from "./ResolutionPresenter";
import { ApiUnifiedMatchRepository } from "@/src/infrastructure/repositories/api/ApiUnifiedMatchRepository";
import { ApiUnifiedTeamRepository } from "@/src/infrastructure/repositories/api/ApiUnifiedTeamRepository";
import { ApiUnifiedLeagueRepository } from "@/src/infrastructure/repositories/api/ApiUnifiedLeagueRepository";
import { ApiUnifiedPlayerRepository } from "@/src/infrastructure/repositories/api/ApiUnifiedPlayerRepository";

export class ResolutionPresenterClientFactory {
  static create(): ResolutionPresenter {
    return new ResolutionPresenter(
      new ApiUnifiedMatchRepository(),
      new ApiUnifiedTeamRepository(),
      new ApiUnifiedLeagueRepository(),
      new ApiUnifiedPlayerRepository(),
    );
  }
}

export function createClientResolutionPresenter(): ResolutionPresenter {
  return ResolutionPresenterClientFactory.create();
}
