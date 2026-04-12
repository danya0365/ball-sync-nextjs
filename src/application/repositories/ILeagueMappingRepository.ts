/**
 * ILeagueMappingRepository
 * Interface for resolving source leagues to unified leagues.
 */
export interface ILeagueMappingRepository {
  /**
   * Resolve a source-specific league to a unified league ID.
   */
  findUnifiedId(sourceName: string, externalId: string): Promise<string | null>;

  /**
   * Link a source-specific league to a unified league.
   */
  createMapping(sourceName: string, externalId: string, unifiedLeagueId: string): Promise<void>;
}
