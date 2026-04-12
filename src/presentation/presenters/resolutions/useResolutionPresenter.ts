"use client";

import { useState, useEffect, useCallback } from "react";
import { ResolutionViewModel, ResolutionDomain } from "./ResolutionPresenter";
import { createClientResolutionPresenter } from "./ResolutionPresenterClientFactory";

export function useResolutionPresenter(initialViewModel?: ResolutionViewModel) {
  const [viewModel, setViewModel] = useState<ResolutionViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

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

  const [activeDomain, setActiveDomain] = useState<ResolutionDomain>('matches');

  return {
    viewModel,
    loading,
    error,
    activeDomain,
    setActiveDomain,
    refresh: loadData,
    approveMatch,
    mergeMatches,
    fetchApprovedCandidates
  };
}
