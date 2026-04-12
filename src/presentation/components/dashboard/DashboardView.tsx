"use client";

import { useDashboardPresenter } from "@/src/presentation/presenters/dashboard/useDashboardPresenter";
import { DashboardViewModel } from "@/src/presentation/presenters/dashboard/DashboardPresenter";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/presentation/components/ui/Card";
import { Activity, Users, Server, Zap, Database } from "lucide-react";

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
      
      {/* Golden Records Table */}
      <Card className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border-white/40 dark:border-white/5 shadow-xl">
        <CardHeader className="border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Database className="w-5 h-5 text-brand-500" />
                Golden Records
              </CardTitle>
              <p className="text-xs text-slate-500 mt-1">Unified latest matches from all trusted sources.</p>
            </div>
            <div className="text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 px-3 py-1.5 rounded-full shadow-sm">
              {viewModel.recentMatches?.length || 0} Records
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200/50 dark:border-slate-800/50">
                <tr>
                  <th className="px-6 py-4 font-semibold">Match Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Matchup</th>
                  <th className="px-6 py-4 font-semibold text-center">Score</th>
                  <th className="px-6 py-4 font-semibold text-right">Primary Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {viewModel.recentMatches?.map((match) => (
                  <tr key={match.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400 font-medium">
                      {new Date(match.matchDate).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        match.status === 'IN_PLAY' || match.status === 'TIMED' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border border-green-200 dark:border-green-500/30'
                          : match.status === 'FINISHED'
                            ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                            : 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30'
                      }`}>
                        {match.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{match.homeTeamNameEn}</span>
                        <span className="text-slate-500 dark:text-slate-400 text-xs text-center w-8">vs</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{match.awayTeamNameEn}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-700 dark:text-slate-300 shadow-sm">
                        {match.score.home !== null ? match.score.home : '-'} : {match.score.away !== null ? match.score.away : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {match.isApproved ? (
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" title="Trusted & Verified"></div>
                        ) : (
                           <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" title="Pending Verification"></div>
                        )}
                        <span className="text-xs text-slate-500 dark:text-slate-400">{match.lastUpdatedBySource}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {(!viewModel.recentMatches || viewModel.recentMatches.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No matches synced yet. Go to Data Sources to fetch data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
