"use client";

import { useState, useEffect, useCallback } from "react";
import { ResolutionViewModel, ResolutionDomain } from "./ResolutionPresenter";
import { createClientResolutionPresenter } from "./ResolutionPresenterClientFactory";

export function useResolutionPresenter(initialViewModel?: ResolutionViewModel) {
  const [viewModel, setViewModel] = useState<ResolutionViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [activeDomain, setActiveDomain] = useState<ResolutionDomain>('matches');

  const presenter = createClientResolutionPresenter();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await presenter.getViewModel();
      setViewModel(data);
    } catch (e) {
      setError("Failed to load resolution data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [initialViewModel, loadData]);

  // ---- Matches ----
  const approveMatch = async (id: string) => {
    if (!viewModel) return false;
    
    setViewModel({
      ...viewModel,
      pendingMatches: viewModel.pendingMatches.filter(m => m.id !== id)
    });

    try {
      await presenter.approveMatch(id);
      return true;
    } catch (e) {
      loadData();
      return false;
    }
  };

  const mergeMatches = async (primaryId: string, duplicateId: string) => {
    if (!viewModel) return false;
    setViewModel({ ...viewModel, pendingMatches: viewModel.pendingMatches.filter(m => m.id !== duplicateId) });
    try {
      await presenter.mergeMatches(primaryId, duplicateId);
      return true;
    } catch (e) {
      loadData();
      return false;
    }
  };

  const fetchApprovedCandidates = async (dateRange?: { startDate: string, endDate: string }) => {
    return await presenter.getApprovedMatches(dateRange);
  };

  // ---- Teams ----
  const approveTeam = async (id: string) => {
    if (!viewModel) return false;
    setViewModel({ ...viewModel, pendingTeams: viewModel.pendingTeams.filter(t => t.id !== id) });
    try {
      await presenter.approveTeam(id);
      return true;
    } catch (e) {
      loadData();
      return false;
    }
  };

  const mergeTeams = async (primaryId: string, duplicateId: string) => {
    if (!viewModel) return false;
    setViewModel({ ...viewModel, pendingTeams: viewModel.pendingTeams.filter(t => t.id !== duplicateId) });
    try {
      await presenter.mergeTeams(primaryId, duplicateId);
      return true;
    } catch (e) {
      loadData();
      return false;
    }
  };

  // ---- Leagues ----
  const approveLeague = async (id: string) => {
    if (!viewModel) return false;
    setViewModel({ ...viewModel, pendingLeagues: viewModel.pendingLeagues.filter(l => l.id !== id) });
    try {
      await presenter.approveLeague(id);
      return true;
    } catch (e) {
      loadData();
      return false;
    }
  };

  const mergeLeagues = async (primaryId: string, duplicateId: string) => {
    if (!viewModel) return false;
    setViewModel({ ...viewModel, pendingLeagues: viewModel.pendingLeagues.filter(l => l.id !== duplicateId) });
    try {
      await presenter.mergeLeagues(primaryId, duplicateId);
      return true;
    } catch (e) {
      loadData();
      return false;
    }
  };

  // ---- Players ----
  const approvePlayer = async (id: string) => {
    if (!viewModel) return false;
    setViewModel({ ...viewModel, pendingPlayers: viewModel.pendingPlayers.filter(p => p.id !== id) });
    try {
      await presenter.approvePlayer(id);
      return true;
    } catch (e) {
      loadData();
      return false;
    }
  };

  const mergePlayers = async (primaryId: string, duplicateId: string) => {
    if (!viewModel) return false;
    setViewModel({ ...viewModel, pendingPlayers: viewModel.pendingPlayers.filter(p => p.id !== duplicateId) });
    try {
      await presenter.mergePlayers(primaryId, duplicateId);
      return true;
    } catch (e) {
      loadData();
      return false;
    }
  };

  return {
    viewModel,
    loading,
    error,
    activeDomain,
    setActiveDomain,
    refresh: loadData,
    // Match-specific
    approveMatch,
    mergeMatches,
    fetchApprovedCandidates,
    // Teams
    approveTeam,
    mergeTeams,
    // Leagues
    approveLeague,
    mergeLeagues,
    // Players
    approvePlayer,
    mergePlayers,
  };
}
