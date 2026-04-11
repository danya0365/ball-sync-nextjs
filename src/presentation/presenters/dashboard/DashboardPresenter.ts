import { IDashboardRepository, DashboardStats, ApiUsageTrend } from "@/src/application/repositories/IDashboardRepository";

export interface DashboardViewModel {
  stats: DashboardStats;
  trends: ApiUsageTrend[];
}

export class DashboardPresenter {
  constructor(private readonly repository: IDashboardRepository) {}

  async getViewModel(): Promise<DashboardViewModel> {
    const [stats, trends] = await Promise.all([
      this.repository.getStats(),
      this.repository.getUsageTrends()
    ]);
    return { stats, trends };
  }
}
