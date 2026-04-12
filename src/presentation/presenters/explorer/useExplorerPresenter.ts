"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createClientExplorerPresenter } from "./ExplorerPresenterClientFactory";
import { ExplorerDomain, ExplorerTableType } from "./ExplorerPresenter";

import { UnifiedMatch } from "@/src/application/repositories/IUnifiedMatchRepository";
import { SourceMatch } from "@/src/application/repositories/ISourceMatchRepository";

export function useExplorerPresenter() {
  const [activeDomain, setActiveDomain] = useState<ExplorerDomain>('matches');
  const [activeTable, setActiveTable] = useState<ExplorerTableType>('unified');
  
  const [unifiedMatches, setUnifiedMatches] = useState<UnifiedMatch[]>([]);
  const [sourceMatches, setSourceMatches] = useState<SourceMatch[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presenter = createClientExplorerPresenter();
  const limit = 20;

  const requestRef = React.useRef(0);

  const loadData = useCallback(async (domain: ExplorerDomain, table: ExplorerTableType, p: number) => {
    const requestId = ++requestRef.current;
    
    setLoading(true);
    setError(null);
    try {
      if (domain === 'matches') {
        if (table === 'unified') {
          setUnifiedMatches([]);
          const res = await presenter.loadUnifiedMatches(p, limit);
          if (requestId === requestRef.current) {
            setUnifiedMatches(res.data);
            setTotal(res.total);
          }
        } else if (table === 'source') {
          setSourceMatches([]);
          const res = await presenter.loadSourceMatches(p, limit);
          if (requestId === requestRef.current) {
            setSourceMatches(res.data);
            setTotal(res.total);
          }
        }
      } else if (domain === 'teams') {
        // Future extensions...
        setTotal(0);
      }
    } catch (e) {
      if (requestId === requestRef.current) {
        setError(`Failed to load ${domain} -> ${table}`);
        setTotal(0);
      }
    } finally {
      if (requestId === requestRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadData(activeDomain, activeTable, page);
  }, [activeDomain, activeTable, page, loadData]);

  // Handle Domain/Table change to reset page
  const handleDomainChange = (domain: ExplorerDomain) => {
    setActiveDomain(domain);
    setPage(1);
  };

  const handleTableChange = (table: ExplorerTableType) => {
    setActiveTable(table);
    setPage(1);
  };

  return {
    activeDomain,
    setActiveDomain: handleDomainChange,
    activeTable,
    setActiveTable: handleTableChange,
    unifiedMatches,
    sourceMatches,
    total,
    page,
    setPage,
    loading,
    error,
    limit,
    refresh: () => loadData(activeDomain, activeTable, page)
  };
}
