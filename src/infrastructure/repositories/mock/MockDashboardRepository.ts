import { IDashboardRepository, DashboardStats, ApiUsageTrend } from "@/src/application/repositories/IDashboardRepository";

export class MockDashboardRepository implements IDashboardRepository {
  async getStats(): Promise<DashboardStats> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      totalRequests: 12500000,
      activeDevelopers: 842,
      uptimePercentage: 99.99,
      averageLatencyMs: 45,
    };
  }

  async getUsageTrends(): Promise<ApiUsageTrend[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return Array.from({ length: 7 }).map((_, i) => ({
      date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
      requests: Math.floor(Math.random() * 2000000) + 1000000,
    }));
  }
}
