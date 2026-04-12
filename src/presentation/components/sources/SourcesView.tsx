"use client";

import { useSourcesPresenter } from "@/src/presentation/presenters/sources/useSourcesPresenter";
import { SourcesViewModel, SourcesDomain } from "@/src/presentation/presenters/sources/SourcesPresenter";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/presentation/components/ui/Card";
import { Button } from "@/src/presentation/components/ui/Button";
import { Database, RefreshCw, Server, AlertCircle, CheckCircle2, History } from "lucide-react";

const DOMAINS: { id: SourcesDomain, label: string, disabled?: boolean }[] = [
  { id: 'matches', label: 'Matches' },
  { id: 'teams', label: 'Teams', disabled: true },
  { id: 'leagues', label: 'Leagues', disabled: true },
  { id: 'players', label: 'Players', disabled: true },
];

interface SourcesViewProps {
  initialViewModel?: SourcesViewModel;
}

export function SourcesView({ initialViewModel }: SourcesViewProps) {
  const { viewModel, loading, syncingSource, error, activeDomain, setActiveDomain, handleSync } = useSourcesPresenter(initialViewModel);

  if (loading || !viewModel) {
    return <div className="animate-pulse space-y-4 p-4">
      <div className="h-10 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(i => <div key={i} className="h-40 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl"></div>)}
      </div>
    </div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Data Sources
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage and sync external football APIs into our Unified Records.</p>
        </div>
        <button 
          className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand-500/25 transition-all transform active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
          onClick={() => handleSync('all')}
          disabled={syncingSource !== null}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${syncingSource === 'all' ? 'animate-spin' : ''}`} />
          {syncingSource === 'all' ? 'Syncing Pipeline...' : 'Sync All Sources'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 backdrop-blur-md flex items-center shadow-sm">
          <AlertCircle className="h-5 w-5 mr-3" />
          <span className="font-medium text-sm">{error}</span>
        </div>
      )}

      {/* Tier 1: Domain Selection */}
      <div className="flex flex-wrap gap-2">
        {DOMAINS.map(domain => (
          <button
            key={domain.id}
            onClick={() => !domain.disabled && setActiveDomain(domain.id)}
            disabled={domain.disabled}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeDomain === domain.id
                ? "bg-slate-800 dark:bg-white text-white dark:text-slate-900 shadow-md transform scale-105"
                : domain.disabled
                  ? "bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-dashed border-slate-300 dark:border-slate-700"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
            }`}
          >
            {domain.label}
            {domain.disabled && <span className="ml-2 text-[10px] font-normal uppercase tracking-wider opacity-60">Soon</span>}
          </button>
        ))}
      </div>

      {activeDomain === 'matches' && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {viewModel.sources.map((source) => (
          <Card key={source.name} className="relative overflow-hidden bg-white/70 dark:bg-slate-900/50 backdrop-blur-md border border-white/50 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all group">
            {/* Connection Status Bar */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 transition-colors duration-500 ${source.isOnline ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-rose-500'}`} />
            
            <CardHeader className="pb-2 pt-6">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg shadow-inner">
                    <Database className="h-5 w-5 text-brand-500" />
                  </div>
                  {source.name}
                </CardTitle>
                <div className="flex items-center text-xs font-mono text-slate-500 bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                  <Server className="h-3 w-3 mr-1.5 text-slate-400" />
                  {source.pingMs}ms
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center">
                  {source.isOnline ? (
                     <div className="flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full">
                       <CheckCircle2 className="h-4 w-4 mr-1.5" /> Optimal Connection
                     </div>
                  ) : (
                     <div className="flex items-center text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-3 py-1.5 rounded-full">
                       <AlertCircle className="h-4 w-4 mr-1.5" /> Disconnected
                     </div>
                  )}
                </div>
                <button 
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold rounded-lg shadow-sm transition-colors border border-slate-200/50 dark:border-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  onClick={() => handleSync(source.name)}
                  disabled={syncingSource !== null || !source.isOnline}
                >
                  {syncingSource === source.name ? (
                    <><RefreshCw className="mr-2 h-4 w-4 animate-spin text-brand-500" /> Fetching</>
                  ) : 'Sync Now'}
                </button>
              </div>
            </CardContent>

            {/* Micro animation rings when syncing */}
            {syncingSource === source.name && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl animate-ping pointer-events-none" />
            )}
          </Card>
        ))}
      </div>
      )}

      <div className="pt-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-6">
          <History className="w-5 h-5 text-brand-500" />
          Sync History Pipeline
        </h2>
        
        <Card className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border-white/40 dark:border-white/5 shadow-xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200/50 dark:border-slate-800/50">
                <tr>
                  <th className="px-6 py-4 font-semibold">Time UTC</th>
                  <th className="px-6 py-4 font-semibold">Source</th>
                  <th className="px-6 py-4 font-semibold">Trigger</th>
                  <th className="px-6 py-4 font-semibold text-center">Injest Count</th>
                  <th className="px-6 py-4 font-semibold text-right">Latency</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {viewModel.logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium border-dashed">
                      No sync history available in pipeline
                    </td>
                  </tr>
                ) : (
                  viewModel.logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400 font-medium font-mono text-xs">
                        {new Date(log.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'medium' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800 dark:text-slate-200">
                        {log.sourceName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                          {log.triggeredBy}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-slate-600 dark:text-slate-300 font-bold">
                        {log.recordsProcessed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-xs text-slate-500 dark:text-slate-400">
                        {log.durationMs}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {log.status === 'success' ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" title="Success">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400" title={log.errorMessage}>
                            <AlertCircle className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
