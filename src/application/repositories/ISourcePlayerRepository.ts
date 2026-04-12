import { NormalizedPlayer } from "@/src/application/services/IExternalFootballService";

export interface SourcePlayer {
  id: string;
  sourceName: string;
  externalId: string;
  name?: string | null;
  nationality?: string | null;
  position?: string | null;
  dateOfBirth?: string | null;
  unifiedPlayerId?: string | null;
  rawData?: any;
}

export interface SourcePlayerQuery {
  sourceName?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  pagination?: {
    limit: number;
    offset?: number;
  };
}

export interface SourcePlayerQueryResult {
  data: SourcePlayer[];
  total?: number;
}

/**
 * ISourcePlayerRepository
 * Stores raw/normalized player data per source.
 */
export interface ISourcePlayerRepository {
  query(params: SourcePlayerQuery): Promise<SourcePlayerQueryResult>;
  upsert(player: NormalizedPlayer, unifiedPlayerId?: string): Promise<void>;
  getBySource(sourceName: string, externalId: string): Promise<SourcePlayer | null>;
}
