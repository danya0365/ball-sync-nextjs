/**
 * ITeamMappingRepository
 * Interface for resolving source teams to unified teams.
 */
export interface ITeamMappingRepository {
  /**
   * Resolve a source-specific team to a unified team ID.
   */
  findUnifiedId(sourceName: string, externalId: string): Promise<string | null>;

  /**
   * Link a source-specific team to a unified team.
   */
  createMapping(sourceName: string, externalId: string, unifiedTeamId: string): Promise<void>;
}
