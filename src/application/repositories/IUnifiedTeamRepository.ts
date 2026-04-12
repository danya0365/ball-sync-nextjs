/**
 * UnifiedTeam
 * The central "Golden Record" format for Teams
 */
export interface UnifiedTeam {
  id: string;
  nameEn: string;
  nameTh?: string;
  shortName?: string;
  tla?: string;
  country?: string;
  crestUrl?: string;
  foundedYear?: number;
  venueName?: string;
  website?: string;
  lastUpdatedBySource: string;
  updatedAt: string;
  isApproved: boolean;
}

export interface UnifiedTeamQuery {
  filters?: {
    country?: string;
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

export interface UnifiedTeamQueryResult {
  data: UnifiedTeam[];
  total?: number;
}

export interface IUnifiedTeamRepository {
  query(params: UnifiedTeamQuery): Promise<UnifiedTeamQueryResult>;
  getById(id: string): Promise<UnifiedTeam | null>;
  approveRecord(id: string): Promise<boolean>;
  mergeRecords(primaryId: string, duplicateId: string): Promise<boolean>;
  upsert(team: Partial<UnifiedTeam>): Promise<UnifiedTeam>;
}
