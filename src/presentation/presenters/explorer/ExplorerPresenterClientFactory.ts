"use client";

import { ExplorerPresenter } from "./ExplorerPresenter";
import { ApiUnifiedMatchRepository } from "@/src/infrastructure/repositories/api/ApiUnifiedMatchRepository";
import { ApiSourceMatchRepository } from "@/src/infrastructure/repositories/api/ApiSourceMatchRepository";

export class ExplorerPresenterClientFactory {
  static create(): ExplorerPresenter {
    const unifiedRepo = new ApiUnifiedMatchRepository();
    const sourceRepo = new ApiSourceMatchRepository();
    return new ExplorerPresenter(unifiedRepo, sourceRepo);
  }
}

export function createClientExplorerPresenter(): ExplorerPresenter {
  return ExplorerPresenterClientFactory.create();
}
