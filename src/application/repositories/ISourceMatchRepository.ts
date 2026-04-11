import { NormalizedMatch } from "@/src/application/services/IExternalFootballService";

/**
 * ISourceMatchRepository
 * Stores raw/normalized data per source.
 */
export interface ISourceMatchRepository {
  upsert(match: NormalizedMatch, unifiedMatchId?: string): Promise<void>;
  getBySource(sourceName: string, externalId: string): Promise<any | null>;
}
