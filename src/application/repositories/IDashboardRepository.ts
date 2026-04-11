export interface DashboardStats {
  totalRequests: number;
  activeDevelopers: number;
  uptimePercentage: number;
  averageLatencyMs: number;
}

export interface ApiUsageTrend {
  date: string;
  requests: number;
}

export interface IDashboardRepository {
  getStats(): Promise<DashboardStats>;
  getUsageTrends(): Promise<ApiUsageTrend[]>;
}
