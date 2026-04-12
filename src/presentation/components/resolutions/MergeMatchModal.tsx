"use client";

import { useState, useEffect } from "react";
import { UnifiedMatch } from "@/src/application/repositories/IUnifiedMatchRepository";
import { X, Search, CheckCircle, GripHorizontal } from "lucide-react";

interface MergeMatchModalProps {
  duplicateMatch: UnifiedMatch | null;
  onClose: () => void;
  onMerge: (primaryId: string, duplicateId: string) => Promise<boolean>;
  fetchApprovedCandidates: (dateRange?: { startDate: string, endDate: string }) => Promise<UnifiedMatch[]>;
}

export function MergeMatchModal({ duplicateMatch, onClose, onMerge, fetchApprovedCandidates }: MergeMatchModalProps) {
  const [candidates, setCandidates] = useState<UnifiedMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPrimary, setSelectedPrimary] = useState<string | null>(null);
  const [merging, setMerging] = useState(false);

  useEffect(() => {
    if (duplicateMatch) {
      loadCandidates();
    }
  }, [duplicateMatch]);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      // Find matches within a 3-day window of the duplicate match
      const date = new Date(duplicateMatch!.matchDate);
      const start = new Date(date).setDate(date.getDate() - 3);
      const end = new Date(date).setDate(date.getDate() + 3);

      const matches = await fetchApprovedCandidates({
        startDate: new Date(start).toISOString(),
        endDate: new Date(end).toISOString()
      });
      setCandidates(matches);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!duplicateMatch) return null;

  const handleMerge = async () => {
    if (!selectedPrimary) return;
    setMerging(true);
    await onMerge(selectedPrimary, duplicateMatch.id);
    setMerging(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Merge Pending Match</h2>
            <p className="text-sm text-slate-500">Select an approved Golden Record to absorb this duplicate.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-y-auto">
          {/* Left Side: The Duplicate */}
          <div className="p-6 bg-rose-50/50 dark:bg-rose-900/10 border-r border-slate-100 dark:border-slate-800">
            <div className="mb-4 inline-flex items-center px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
              Pending Record (Will be Deleted)
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-400 mb-1 font-mono">{new Date(duplicateMatch.matchDate).toLocaleString()}</div>
                <div className="font-bold text-lg text-slate-800 dark:text-slate-100">{duplicateMatch.homeTeamNameEn}</div>
                <div className="text-slate-400 text-sm italic my-1">vs</div>
                <div className="font-bold text-lg text-slate-800 dark:text-slate-100">{duplicateMatch.awayTeamNameEn}</div>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between text-xs">
                  <span className="text-slate-500">Source: <span className="font-mono bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-[10px]">{duplicateMatch.lastUpdatedBySource}</span></span>
                  <span className="text-slate-500">Status: {duplicateMatch.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Primary Candidates */}
          <div className="p-6 bg-emerald-50/30 dark:bg-emerald-900/5 relative">
            <div className="absolute top-1/2 -left-3.5 -translate-y-1/2 w-7 h-7 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center z-10 hidden md:flex text-slate-400">
              <GripHorizontal className="w-4 h-4" />
            </div>

            <div className="mb-4 inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Target Golden Record (Will Absorb Source APIs)
            </div>
            
            {loading ? (
              <div className="text-center p-8 text-slate-500 animate-pulse">Finding candidates +/- 3 days...</div>
            ) : candidates.length === 0 ? (
              <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 text-sm">
                No approved matches found around this date.
              </div>
            ) : (
              <div className="space-y-3">
                {candidates.map(candidate => {
                  const isSelected = selectedPrimary === candidate.id;
                  return (
                    <div 
                      key={candidate.id}
                      onClick={() => setSelectedPrimary(candidate.id)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border ${
                        isSelected 
                          ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 shadow-md ring-2 ring-emerald-500/20" 
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs text-slate-400 mb-1 font-mono">{new Date(candidate.matchDate).toLocaleString()}</div>
                          <div className={`font-semibold ${isSelected ? "text-emerald-900 dark:text-emerald-100" : "text-slate-800 dark:text-slate-200"}`}>
                            {candidate.homeTeamNameEn} vs {candidate.awayTeamNameEn}
                          </div>
                        </div>
                        {isSelected && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
            Cancel
          </button>
          <button 
            disabled={!selectedPrimary || merging}
            onClick={handleMerge}
            className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 disabled:dark:bg-slate-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2"
          >
            {merging ? "Merging..." : "Confirm Merge"}
          </button>
        </div>

      </div>
    </div>
  );
}
