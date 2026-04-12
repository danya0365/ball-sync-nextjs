"use client";

import { useState } from "react";
import { useResolutionPresenter } from "../../presenters/resolutions/useResolutionPresenter";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { CheckCircle, ShieldAlert, Clock, Info, GitMerge } from "lucide-react";

import { ResolutionViewModel, ResolutionDomain } from "../../presenters/resolutions/ResolutionPresenter";
import { MergeMatchModal } from "./MergeMatchModal";
import { UnifiedMatch } from "@/src/application/repositories/IUnifiedMatchRepository";

const DOMAINS: { id: ResolutionDomain, label: string, disabled?: boolean }[] = [
  { id: 'matches', label: 'Matches' },
  { id: 'teams', label: 'Teams', disabled: true },
  { id: 'leagues', label: 'Leagues', disabled: true },
  { id: 'players', label: 'Players', disabled: true },
];

export function ResolutionView({ initialViewModel }: { initialViewModel?: ResolutionViewModel }) {
  const { viewModel, loading, error, activeDomain, setActiveDomain, approveMatch, mergeMatches, fetchApprovedCandidates } = useResolutionPresenter(initialViewModel);
  const [mergeTarget, setMergeTarget] = useState<UnifiedMatch | null>(null);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500 animate-pulse">
        <ShieldAlert className="w-12 h-12 mb-4 text-slate-300" />
        <p>Scanning unverified matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-900/50">
        <p className="flex items-center gap-2"><ShieldAlert className="w-5 h-5" /> {error}</p>
      </div>
    );
  }

  const matches = viewModel?.pendingMatches || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          Resolution Center
        </h1>
        <div className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          {matches.length} Pending
        </div>
      </div>

      <p className="text-slate-600 dark:text-slate-400 text-sm">
        Review unverified matches pulled from sources. Approve to promote them to Golden Records, or Merge duplicate records together.
      </p>

      {/* Tier 1: Domain Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
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
        matches.length === 0 ? (
        <Card className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border-white/40 dark:border-white/5 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-16 text-center text-slate-500">
            <CheckCircle className="w-12 h-12 mb-4 text-green-400" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">All Caught Up!</h3>
            <p className="text-sm mt-2 max-w-md">There are no pending matches requiring administrative approval. Everything looks clean and synced.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {matches.map((match) => (
            <Card key={match.id} className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-md border-white/50 dark:border-white/5 hover:bg-white/90 dark:hover:bg-slate-900/70 transition-all hover:shadow-lg group">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Info Block */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(match.matchDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {match.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-lg">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{match.homeTeamNameEn}</span>
                      <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">vs</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{match.awayTeamNameEn}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Info className="w-3.5 h-3.5" /> Source: <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px]">{match.lastUpdatedBySource}</span>
                    </div>
                  </div>

                  {/* Action Block */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => approveMatch(match.id)}
                      className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-500/25 transition-all transform active:scale-95 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Match
                    </button>
                    <button 
                      onClick={() => setMergeTarget(match)}
                      className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
                    >
                      <GitMerge className="w-4 h-4" />
                      Merge Into...
                    </button>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}

      {/* Merge Modal */}
      {mergeTarget && (
        <MergeMatchModal
          duplicateMatch={mergeTarget}
          onClose={() => setMergeTarget(null)}
          onMerge={mergeMatches}
          fetchApprovedCandidates={fetchApprovedCandidates}
        />
      )}
    </div>
  );
}
