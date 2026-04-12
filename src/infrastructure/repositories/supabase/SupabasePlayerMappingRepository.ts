import { IPlayerMappingRepository } from "@/src/application/repositories/IPlayerMappingRepository";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * SupabasePlayerMappingRepository
 * Resolves source players to unified players using Supabase.
 */
export class SupabasePlayerMappingRepository implements IPlayerMappingRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findUnifiedId(sourceName: string, externalId: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('player_mappings')
      .select('unified_player_id')
      .eq('source_name', sourceName)
      .eq('external_id', externalId)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data ? data.unified_player_id : null;
  }

  async createMapping(sourceName: string, externalId: string, unifiedPlayerId: string): Promise<void> {
    const { error } = await this.supabase
      .from('player_mappings')
      .insert({
        source_name: sourceName,
        external_id: externalId,
        unified_player_id: unifiedPlayerId
      });

    if (error) throw new Error(error.message);
  }
}
