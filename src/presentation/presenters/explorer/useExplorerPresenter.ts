"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClientExplorerPresenter } from "./ExplorerPresenterClientFactory";
import { ExplorerDomain, ExplorerTableType } from "./ExplorerPresenter";

import { UnifiedMatch } from "@/src/application/repositories/IUnifiedMatchRepository";
import { SourceMatch } from "@/src/application/repositories/ISourceMatchRepository";
import { UnifiedTeam } from "@/src/application/repositories/IUnifiedTeamRepository";
import { SourceTeam } from "@/src/application/repositories/ISourceTeamRepository";
import { UnifiedLeague } from "@/src/application/repositories/IUnifiedLeagueRepository";
import { SourceLeague } from "@/src/application/repositories/ISourceLeagueRepository";
import { UnifiedPlayer } from "@/src/application/repositories/IUnifiedPlayerRepository";
import { SourcePlayer } from "@/src/application/repositories/ISourcePlayerRepository";

export function useExplorerPresenter() {
  const [activeDomain, setActiveDomain] = useState<ExplorerDomain>('matches');
  const [activeTable, setActiveTable] = useState<ExplorerTableType>('unified');
  
  // Matches
  const [unifiedMatches, setUnifiedMatches] = useState<UnifiedMatch[]>([]);
  const [sourceMatches, setSourceMatches] = useState<SourceMatch[]>([]);
  // Teams
  const [unifiedTeams, setUnifiedTeams] = useState<UnifiedTeam[]>([]);
  const [sourceTeams, setSourceTeams] = useState<SourceTeam[]>([]);
  // Leagues
  const [unifiedLeagues, setUnifiedLeagues] = useState<UnifiedLeague[]>([]);
  const [sourceLeagues, setSourceLeagues] = useState<SourceLeague[]>([]);
  // Players
  const [unifiedPlayers, setUnifiedPlayers] = useState<UnifiedPlayer[]>([]);
  const [sourcePlayers, setSourcePlayers] = useState<SourcePlayer[]>([]);

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
          if (requestId === requestRef.current) { setUnifiedMatches(res.data); setTotal(res.total); }
        } else {
          setSourceMatches([]);
          const res = await presenter.loadSourceMatches(p, limit);
          if (requestId === requestRef.current) { setSourceMatches(res.data); setTotal(res.total); }
        }
      } else if (domain === 'teams') {
        if (table === 'unified') {
          setUnifiedTeams([]);
          const res = await presenter.loadUnifiedTeams(p, limit);
          if (requestId === requestRef.current) { setUnifiedTeams(res.data); setTotal(res.total); }
        } else {
          setSourceTeams([]);
          const res = await presenter.loadSourceTeams(p, limit);
          if (requestId === requestRef.current) { setSourceTeams(res.data); setTotal(res.total); }
        }
      } else if (domain === 'leagues') {
        if (table === 'unified') {
          setUnifiedLeagues([]);
          const res = await presenter.loadUnifiedLeagues(p, limit);
          if (requestId === requestRef.current) { setUnifiedLeagues(res.data); setTotal(res.total); }
        } else {
          setSourceLeagues([]);
          const res = await presenter.loadSourceLeagues(p, limit);
          if (requestId === requestRef.current) { setSourceLeagues(res.data); setTotal(res.total); }
        }
      } else if (domain === 'players') {
        if (table === 'unified') {
          setUnifiedPlayers([]);
          const res = await presenter.loadUnifiedPlayers(p, limit);
          if (requestId === requestRef.current) { setUnifiedPlayers(res.data); setTotal(res.total); }
        } else {
          setSourcePlayers([]);
          const res = await presenter.loadSourcePlayers(p, limit);
          if (requestId === requestRef.current) { setSourcePlayers(res.data); setTotal(res.total); }
        }
      }
    } catch (e) {
      if (requestId === requestRef.current) {
        setError(`Failed to load ${domain} → ${table}`);
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
    unifiedMatches, sourceMatches,
    unifiedTeams, sourceTeams,
    unifiedLeagues, sourceLeagues,
    unifiedPlayers, sourcePlayers,
    total, page, setPage,
    loading, error, limit,
    refresh: () => loadData(activeDomain, activeTable, page)
  };
}
