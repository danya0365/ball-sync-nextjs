import { ApiUsageTrend, DashboardStats, IDashboardRepository } from "@/src/application/repositories/IDashboardRepository";
import { IUnifiedMatchRepository, UnifiedMatch } from "@/src/application/repositories/IUnifiedMatchRepository";

export interface DashboardViewModel {
  stats: DashboardStats;
  trends: ApiUsageTrend[];
  recentMatches: UnifiedMatch[];
}

export class DashboardPresenter {
  constructor(
    private readonly repository: IDashboardRepository,
    private readonly matchRepository: IUnifiedMatchRepository
  ) {}

  async getViewModel(): Promise<DashboardViewModel> {
    const [stats, trends, recentMatchesResult] = await Promise.all([
      this.repository.getStats(),
      this.repository.getUsageTrends(),
      this.matchRepository.query({ 
        sortBy: 'match_date', 
        sortOrder: 'desc', 
        pagination: { limit: 20 } 
      })
    ]);

    return { stats, trends, recentMatches: recentMatchesResult.data };
  }
}
