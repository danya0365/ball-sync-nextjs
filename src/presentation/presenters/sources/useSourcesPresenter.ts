"use client";

import { useState, useEffect, useCallback } from "react";
import { SourcesViewModel, SourcesDomain } from "./SourcesPresenter";
import { createClientSourcesPresenter } from "./SourcesPresenterClientFactory";
import { SyncDomain } from "@/src/application/use-cases/SyncFootballDataUseCase";

export function useSourcesPresenter(initialViewModel?: SourcesViewModel) {
  const [viewModel, setViewModel] = useState<SourcesViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [syncingSource, setSyncingSource] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeDomain, setActiveDomain] = useState<SourcesDomain>('matches');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const presenter = createClientSourcesPresenter();
      const data = await presenter.getViewModel();
      setViewModel(data);
    } catch (e) {
      setError("Failed to load sources data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [initialViewModel, loadData]);

  const handleSync = async (sourceName: string, domain?: SyncDomain) => {
    setSyncingSource(sourceName);
    setError(null);
    try {
      const presenter = createClientSourcesPresenter();
      await presenter.triggerManualSync(sourceName, domain || activeDomain as SyncDomain);
      // Reload logs after sync
      await loadData();
    } catch (e: any) {
      setError(e.message || "Failed to trigger sync");
    } finally {
      setSyncingSource(null);
    }
  };

  return {
    viewModel,
    loading,
    syncingSource,
    error,
    activeDomain,
    setActiveDomain,
    handleSync,
    refresh: loadData
  };
}
