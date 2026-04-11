"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardViewModel } from "./DashboardPresenter";
import { createClientDashboardPresenter } from "./DashboardPresenterClientFactory";

export function useDashboardPresenter(initialViewModel?: DashboardViewModel) {
  const [viewModel, setViewModel] = useState<DashboardViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const presenter = createClientDashboardPresenter();
      const data = await presenter.getViewModel();
      setViewModel(data);
    } catch (e) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [initialViewModel, loadData]);

  return {
    viewModel,
    loading,
    error,
    refresh: loadData
  };
}
