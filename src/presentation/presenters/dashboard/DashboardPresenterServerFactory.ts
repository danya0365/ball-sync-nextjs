import { DashboardPresenter } from "./DashboardPresenter";
import { MockDashboardRepository } from "@/src/infrastructure/repositories/mock/MockDashboardRepository";

export class DashboardPresenterServerFactory {
  static create(): DashboardPresenter {
    const repository = new MockDashboardRepository();
    return new DashboardPresenter(repository);
  }
}

export function createServerDashboardPresenter(): DashboardPresenter {
  return DashboardPresenterServerFactory.create();
}
