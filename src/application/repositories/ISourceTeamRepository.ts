import { NormalizedTeam } from "@/src/application/services/IExternalFootballService";

export interface SourceTeam {
  id: string;
  sourceName: string;
  externalId: string;
  name?: string | null;
  shortName?: string | null;
  country?: string | null;
  crestUrl?: string | null;
  unifiedTeamId?: string | null;
  rawData?: any;
}

export interface SourceTeamQuery {
  sourceName?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  pagination?: {
    limit: number;
    offset?: number;
  };
}

export interface SourceTeamQueryResult {
  data: SourceTeam[];
  total?: number;
}

/**
 * ISourceTeamRepository
 * Stores raw/normalized team data per source.
 */
export interface ISourceTeamRepository {
  query(params: SourceTeamQuery): Promise<SourceTeamQueryResult>;
  upsert(team: NormalizedTeam, unifiedTeamId?: string): Promise<void>;
  getBySource(sourceName: string, externalId: string): Promise<SourceTeam | null>;
}
