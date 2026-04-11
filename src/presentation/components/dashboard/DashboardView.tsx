"use client";

import { useDashboardPresenter } from "@/src/presentation/presenters/dashboard/useDashboardPresenter";
import { DashboardViewModel } from "@/src/presentation/presenters/dashboard/DashboardPresenter";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/presentation/components/ui/Card";
import { Activity, Users, Server, Zap } from "lucide-react";

interface DashboardViewProps {
  initialViewModel?: DashboardViewModel;
}

export function DashboardView({ initialViewModel }: DashboardViewProps) {
  const { viewModel, loading } = useDashboardPresenter(initialViewModel);

  if (loading || !viewModel) {
    return <div className="animate-pulse space-y-4">
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>)}
      </div>
    </div>;
  }

  const { stats } = viewModel;

  const statCards = [
    { title: "Total API Requests", value: `${(stats.totalRequests / 1000000).toFixed(1)}M`, icon: Activity, desc: "Last 30 days" },
    { title: "Active Developers", value: stats.activeDevelopers.toLocaleString(), icon: Users, desc: "+12% from last month" },
    { title: "System Uptime", value: `${stats.uptimePercentage}%`, icon: Server, desc: "All APIs operational" },
    { title: "Avg. Latency", value: `${stats.averageLatencyMs}ms`, icon: Zap, desc: "Across all edge nodes" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-900 dark:text-slate-100">API Data Center</h1>
        <p className="text-slate-500">Monitor BallSync ecosystem usage and sync status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 my-0">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-brand-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Table Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sync Logs</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="text-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 text-sm">
             Table implementation (coming soon)
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
