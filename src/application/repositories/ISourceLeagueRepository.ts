import { NormalizedLeague } from "@/src/application/services/IExternalFootballService";

export interface SourceLeague {
  id: string;
  sourceName: string;
  externalId: string;
  name?: string | null;
  code?: string | null;
  country?: string | null;
  emblemUrl?: string | null;
  unifiedLeagueId?: string | null;
  rawData?: any;
}

export interface SourceLeagueQuery {
  sourceName?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  pagination?: {
    limit: number;
    offset?: number;
  };
}

export interface SourceLeagueQueryResult {
  data: SourceLeague[];
  total?: number;
}

/**
 * ISourceLeagueRepository
 * Stores raw/normalized league data per source.
 */
export interface ISourceLeagueRepository {
  query(params: SourceLeagueQuery): Promise<SourceLeagueQueryResult>;
  upsert(league: NormalizedLeague, unifiedLeagueId?: string): Promise<void>;
  getBySource(sourceName: string, externalId: string): Promise<SourceLeague | null>;
}
