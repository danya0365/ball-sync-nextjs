"use client";

import { SourcesPresenter } from "./SourcesPresenter";
import { ApiSourcesRepository } from "@/src/infrastructure/repositories/api/ApiSourcesRepository";

export class SourcesPresenterClientFactory {
  static create(): SourcesPresenter {
    // 🛡️ Safe for client side: This delegates heavy logic to API routes avoiding CORS
    const repository = new ApiSourcesRepository();
    
    return new SourcesPresenter(repository);
  }
}

export function createClientSourcesPresenter(): SourcesPresenter {
  return SourcesPresenterClientFactory.create();
}
