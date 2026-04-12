import { NormalizedMatch } from "@/src/application/services/IExternalFootballService";

export interface SourceMatchQuery {
  sourceName?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  pagination?: {
    limit: number;
    offset?: number;
  };
}

export interface SourceMatch {
  id: string;
  sourceName: string;
  externalId: string;
  homeTeamName?: string | null;
  awayTeamName?: string | null;
  matchDate?: string | null;
  status?: string | null;
  unifiedMatchId?: string | null;
  rawData?: any;
}

export interface SourceMatchQueryResult {
  data: SourceMatch[];
  total?: number;
}

/**
 * ISourceMatchRepository
 * Stores raw/normalized data per source.
 */
export interface ISourceMatchRepository {
  query(params: SourceMatchQuery): Promise<SourceMatchQueryResult>;
  upsert(match: NormalizedMatch, unifiedMatchId?: string): Promise<void>;
  getBySource(sourceName: string, externalId: string): Promise<any | null>;
}
