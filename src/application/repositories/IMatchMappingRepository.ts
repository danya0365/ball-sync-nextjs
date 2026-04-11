/**
 * IMatchMappingRepository
 * Interface for resolving source entities to unified entities.
 */
export interface IMatchMappingRepository {
  /**
   * Resolve a source-specific match to a unified match ID.
   */
  findUnifiedId(sourceName: string, externalId: string): Promise<string | null>;

  /**
   * Link a source-specific match to a unified match.
   */
  createMapping(source_name: string, external_id: string, unified_match_id: string): Promise<void>;
}
