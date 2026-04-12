"use client";

import { CheckCircle2, ChevronLeft, ChevronRight, Database, Search, ShieldAlert } from "lucide-react";
import { ExplorerDomain } from "../../presenters/explorer/ExplorerPresenter";
import { useExplorerPresenter } from "../../presenters/explorer/useExplorerPresenter";
import { Card } from "../ui/Card";

import { UnifiedMatch } from "@/src/application/repositories/IUnifiedMatchRepository";
import { SourceMatch } from "@/src/application/repositories/ISourceMatchRepository";

const DOMAINS: { id: ExplorerDomain, label: string, disabled?: boolean }[] = [
  { id: 'matches', label: 'Matches' },
  { id: 'teams', label: 'Teams', disabled: true },
  { id: 'leagues', label: 'Leagues', disabled: true },
  { id: 'players', label: 'Players', disabled: true },
];

export function ExplorerView() {
  const { 
    activeDomain, setActiveDomain, 
    activeTable, setActiveTable, 
    unifiedMatches, sourceMatches, total, page, setPage, 
    loading, error, limit 
  } = useExplorerPresenter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
            <Database className="w-8 h-8 text-brand-500" />
            Data Explorer
          </h1>
          <p className="text-slate-500 text-sm mt-1">Centralized hub for all platform data records.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 backdrop-blur-md">
          {error}
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

      <Card className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border-white/40 dark:border-white/5 shadow-xl">
        
        {/* Tier 2: Table Selection (Golden vs Raw) */}
        <div className="flex gap-2 border-b border-slate-200/50 dark:border-slate-800/50 px-2 pt-2 bg-slate-50/50 dark:bg-slate-800/20 rounded-t-xl">
          <button
            onClick={() => setActiveTable('unified')}
            className={`px-5 py-3 text-sm font-semibold transition-all relative ${
              activeTable === 'unified' ? "text-brand-600 dark:text-brand-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Golden Records (Unified)
            {activeTable === 'unified' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />}
          </button>
          <button
            onClick={() => setActiveTable('source')}
            className={`px-5 py-3 text-sm font-semibold transition-all relative ${
              activeTable === 'source' ? "text-brand-600 dark:text-brand-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Raw Input (Sources)
            {activeTable === 'source' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />}
          </button>
        </div>

        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search features coming soon..." 
              disabled
              className="w-full pl-9 pr-4 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500 opacity-50 cursor-not-allowed"
            />
          </div>
          <div className="text-xs text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            Total Records: {total}
          </div>
        </div>

        {/* Tables */}
        <div className="overflow-x-auto custom-scrollbar min-h-[400px]">
          {activeDomain === 'matches' && activeTable === 'unified' && (
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200/50 dark:border-slate-800/50">
                <tr>
                  <th className="px-5 py-4 font-semibold">ID</th>
                  <th className="px-5 py-4 font-semibold">Match Date</th>
                  <th className="px-5 py-4 font-semibold">Home Team</th>
                  <th className="px-5 py-4 font-semibold">Away Team</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold text-center">Approved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {loading && unifiedMatches.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-slate-400">Loading...</td></tr>
                ) : unifiedMatches.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3 font-mono text-[10px] text-slate-400 truncate max-w-[80px]" title={m.id}>{m.id}</td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{new Date(m.matchDate).toLocaleString()}</td>
                    <td className="px-5 py-3 font-semibold text-slate-800 dark:text-slate-200">{m.homeTeamNameEn}</td>
                    <td className="px-5 py-3 font-semibold text-slate-800 dark:text-slate-200">{m.awayTeamNameEn}</td>
                    <td className="px-5 py-3">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs text-slate-600 dark:text-slate-300">{m.status}</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      {m.isApproved ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <ShieldAlert className="w-4 h-4 text-amber-500 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeDomain === 'matches' && activeTable === 'source' && (
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200/50 dark:border-slate-800/50">
                <tr>
                  <th className="px-5 py-4 font-semibold">Source Name</th>
                  <th className="px-5 py-4 font-semibold">External ID</th>
                  <th className="px-5 py-4 font-semibold">Match Date</th>
                  <th className="px-5 py-4 font-semibold">Home Team</th>
                  <th className="px-5 py-4 font-semibold">Away Team</th>
                  <th className="px-5 py-4 font-semibold">Unified Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {loading && sourceMatches.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-slate-400">Loading...</td></tr>
                ) : sourceMatches.map(s => (
                  <tr key={`${s.sourceName}-${s.externalId}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-700 dark:text-slate-300">{s.sourceName}</td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">{s.externalId}</td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{s.matchDate ? new Date(s.matchDate).toLocaleString() : '-'}</td>
                    <td className="px-5 py-3 text-slate-800 dark:text-slate-200">{s.homeTeamName || '-'}</td>
                    <td className="px-5 py-3 text-slate-800 dark:text-slate-200">{s.awayTeamName || '-'}</td>
                    <td className="px-5 py-3">
                      {s.unifiedMatchId ? (
                        <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded truncate block max-w-[100px]" title={s.unifiedMatchId}>
                          {s.unifiedMatchId}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Unmapped</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Toolbar */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
          <div className="text-xs text-slate-500 font-mono">
            Page {page}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={(page * limit >= total)}
              className="p-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </Card>
    </div>
  );
}
