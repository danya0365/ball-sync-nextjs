/**
 * UnifiedLeague
 * The central "Golden Record" format for Leagues/Competitions
 */
export interface UnifiedLeague {
  id: string;
  nameEn: string;
  nameTh?: string;
  code?: string;
  country?: string;
  emblemUrl?: string;
  type: 'LEAGUE' | 'CUP' | 'SUPER_CUP' | 'PLAYOFFS';
  currentSeason?: string;
  lastUpdatedBySource: string;
  updatedAt: string;
  isApproved: boolean;
}

export interface UnifiedLeagueQuery {
  filters?: {
    country?: string;
    type?: string;
    isApproved?: boolean;
  };
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  pagination?: {
    limit: number;
    offset?: number;
  };
}

export interface UnifiedLeagueQueryResult {
  data: UnifiedLeague[];
  total?: number;
}

export interface IUnifiedLeagueRepository {
  query(params: UnifiedLeagueQuery): Promise<UnifiedLeagueQueryResult>;
  getById(id: string): Promise<UnifiedLeague | null>;
  approveRecord(id: string): Promise<boolean>;
  mergeRecords(primaryId: string, duplicateId: string): Promise<boolean>;
  upsert(league: Partial<UnifiedLeague>): Promise<UnifiedLeague>;
}
