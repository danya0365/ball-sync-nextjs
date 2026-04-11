"use client";

import { useSourcesPresenter } from "@/src/presentation/presenters/sources/useSourcesPresenter";
import { SourcesViewModel } from "@/src/presentation/presenters/sources/SourcesPresenter";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/presentation/components/ui/Card";
import { Button } from "@/src/presentation/components/ui/Button";
import { Database, RefreshCw, Server, AlertCircle, CheckCircle2 } from "lucide-react";

interface SourcesViewProps {
  initialViewModel?: SourcesViewModel;
}

export function SourcesView({ initialViewModel }: SourcesViewProps) {
  const { viewModel, loading, syncingSource, error, handleSync } = useSourcesPresenter(initialViewModel);

  if (loading || !viewModel) {
    return <div className="animate-pulse space-y-4">
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(i => <div key={i} className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>)}
      </div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-900 dark:text-slate-100">Data Sources</h1>
          <p className="text-slate-500">Manage and sync external football APIs.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => handleSync('all')}
          disabled={syncingSource !== null}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${syncingSource === 'all' ? 'animate-spin' : ''}`} />
          Sync All Sources
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {viewModel.sources.map((source) => (
          <Card key={source.name} className="overflow-hidden">
            <div className={`h-2 w-full ${source.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center">
                  <Database className="h-5 w-5 mr-2 text-slate-400" />
                  {source.name}
                </CardTitle>
                <div className="flex items-center text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                  <Server className="h-3 w-3 mr-1" />
                  {source.pingMs}ms
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                  {source.isOnline ? (
                     <span className="flex items-center text-sm text-green-600 font-medium">
                       <CheckCircle2 className="h-4 w-4 mr-1" /> Online
                     </span>
                  ) : (
                     <span className="flex items-center text-sm text-red-600 font-medium">
                       <AlertCircle className="h-4 w-4 mr-1" /> Disconnected
                     </span>
                  )}
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleSync(source.name)}
                  disabled={syncingSource !== null || !source.isOnline}
                >
                  {syncingSource === source.name ? (
                    <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Syncing</>
                  ) : 'Sync Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4 tracking-tight text-brand-900 dark:text-slate-100">Sync History</h2>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3 font-medium">Time</th>
                <th className="px-6 py-3 font-medium">Source</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Records</th>
                <th className="px-6 py-3 font-medium">Duration</th>
                <th className="px-6 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {viewModel.logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No sync history available</td>
                </tr>
              ) : (
                viewModel.logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{log.sourceName}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-xs">
                        {log.triggeredBy}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{log.recordsProcessed}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{log.durationMs}ms</td>
                    <td className="px-6 py-4 text-right">
                      {log.status === 'success' ? (
                        <span className="text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md text-xs font-medium">Success</span>
                      ) : (
                        <span className="text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md text-xs font-medium" title={log.errorMessage}>Failed</span>
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
  );
}
