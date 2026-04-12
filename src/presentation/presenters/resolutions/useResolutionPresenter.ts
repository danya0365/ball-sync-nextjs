"use client";

import { useState, useEffect, useCallback } from "react";
import { ResolutionViewModel } from "./ResolutionPresenter";
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
    
    // Optimistic UI update
    setViewModel({
      ...viewModel,
      pendingMatches: viewModel.pendingMatches.filter(m => m.id !== id)
    });

    try {
      await presenter.approveMatch(id);
      return true;
    } catch (e) {
      // Revert on failure
      loadData();
      return false;
    }
  };

  return {
    viewModel,
    loading,
    error,
    refresh: loadData,
    approveMatch
  };
}
