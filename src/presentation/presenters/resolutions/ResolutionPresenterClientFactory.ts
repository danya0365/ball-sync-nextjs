"use client";

import { ResolutionPresenter } from "./ResolutionPresenter";
import { ApiUnifiedMatchRepository } from "@/src/infrastructure/repositories/api/ApiUnifiedMatchRepository";

export class ResolutionPresenterClientFactory {
  static create(): ResolutionPresenter {
    const repository = new ApiUnifiedMatchRepository();
    return new ResolutionPresenter(repository);
  }
}

export function createClientResolutionPresenter(): ResolutionPresenter {
  return ResolutionPresenterClientFactory.create();
}
