/**
 * IPlayerMappingRepository
 * Interface for resolving source players to unified players.
 */
export interface IPlayerMappingRepository {
  /**
   * Resolve a source-specific player to a unified player ID.
   */
  findUnifiedId(sourceName: string, externalId: string): Promise<string | null>;

  /**
   * Link a source-specific player to a unified player.
   */
  createMapping(sourceName: string, externalId: string, unifiedPlayerId: string): Promise<void>;
}
