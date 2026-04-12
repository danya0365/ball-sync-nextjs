import { DashboardPresenter } from "./DashboardPresenter";
import { MockDashboardRepository } from "@/src/infrastructure/repositories/mock/MockDashboardRepository";
import { ApiUnifiedMatchRepository } from "@/src/infrastructure/repositories/api/ApiUnifiedMatchRepository";

export class DashboardPresenterClientFactory {
  static create(): DashboardPresenter {
    const repository = new MockDashboardRepository();
    const matchRepository = new ApiUnifiedMatchRepository();
    return new DashboardPresenter(repository, matchRepository);
  }
}

export function createClientDashboardPresenter(): DashboardPresenter {
  return DashboardPresenterClientFactory.create();
}
