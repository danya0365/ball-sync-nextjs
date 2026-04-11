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
  status: 'SCHEDULED' | 'IN_PLAY' | 'FINISHED' | 'PAUSED' | 'CANCELLED';
  score: {
    home: number | null;
    away: number | null;
    halfTimeHome?: number | null;
    halfTimeAway?: number | null;
  };
  lastUpdatedBySource: string;
  updatedAt: string;
}

/**
 * IUnifiedMatchRepository
 * Repository for the centralized "Golden Record" matches.
 */
export interface IUnifiedMatchRepository {
  getAll(): Promise<UnifiedMatch[]>;
  getById(id: string): Promise<UnifiedMatch | null>;
  upsert(match: Partial<UnifiedMatch>): Promise<UnifiedMatch>;
}
