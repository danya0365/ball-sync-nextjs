import { NormalizedMatch } from "@/src/application/services/IExternalFootballService";

/**
 * IMatchRepository
 * Repository interface for football Match data access
 * Following Clean Architecture - Application layer
 */
export interface IMatchRepository {
  /**
   * Fetch all matches, optionally filtered by status
   */
  getMatches(status?: string): Promise<NormalizedMatch[]>;

  /**
   * Upsert multiple matches into the database
   * Updates existing matches based on externalId
   */
  upsertMany(matches: NormalizedMatch[]): Promise<void>;

  /**
   * Get a single match by its external ID
   */
  getByExternalId(externalId: string): Promise<NormalizedMatch | null>;
}
