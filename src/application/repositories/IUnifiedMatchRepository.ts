import { NormalizedMatch } from "@/src/application/services/IExternalFootballService";

/**
 * UnifiedMatch
 * The central "Golden Record" format
 */
export interface UnifiedMatch {
  id: string;
  leagueNameEn?: string;
  leagueNameTh?: string;
  homeTeamNameEn: string;
  homeTeamNameTh?: string;
  awayTeamNameEn: string;
  awayTeamNameTh?: string;
  matchDate: string;
  status: 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED' | 'EXTRA_TIME' | 'PENALTY_SHOOTOUT' | 'FINISHED' | 'SUSPENDED' | 'POSTPONED' | 'CANCELLED' | 'AWARDED';
  score: {
    home: number | null;
    away: number | null;
    halfTimeHome?: number | null;
    halfTimeAway?: number | null;
  };
  lastUpdatedBySource: string;
  updatedAt: string;
  isApproved: boolean;
}

/**
 * IUnifiedMatchRepository
 * Repository for the centralized "Golden Record" matches.
 */
export interface UnifiedMatchQuery {
  filters?: {
    status?: string | string[];
    isApproved?: boolean;
  };
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  pagination?: {
    limit: number;
    offset?: number;
  };
}

export interface UnifiedMatchQueryResult {
  data: UnifiedMatch[];
  total?: number;
}

export interface IUnifiedMatchRepository {
  query(params: UnifiedMatchQuery): Promise<UnifiedMatchQueryResult>;
  getById(id: string): Promise<UnifiedMatch | null>;
  upsert(match: Partial<UnifiedMatch>): Promise<UnifiedMatch>;
}
