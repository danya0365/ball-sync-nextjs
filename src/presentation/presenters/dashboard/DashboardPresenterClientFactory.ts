"use client";

import { DashboardPresenter } from "./DashboardPresenter";
import { MockDashboardRepository } from "@/src/infrastructure/repositories/mock/MockDashboardRepository";

export class DashboardPresenterClientFactory {
  static create(): DashboardPresenter {
    const repository = new MockDashboardRepository();
    return new DashboardPresenter(repository);
  }
}

export function createClientDashboardPresenter(): DashboardPresenter {
  return DashboardPresenterClientFactory.create();
}
