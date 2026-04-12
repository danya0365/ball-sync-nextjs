import { ILeagueMappingRepository } from "@/src/application/repositories/ILeagueMappingRepository";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * SupabaseLeagueMappingRepository
 * Resolves source leagues to unified leagues using Supabase.
 */
export class SupabaseLeagueMappingRepository implements ILeagueMappingRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findUnifiedId(sourceName: string, externalId: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('league_mappings')
      .select('unified_league_id')
      .eq('source_name', sourceName)
      .eq('external_id', externalId)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data ? data.unified_league_id : null;
  }

  async createMapping(sourceName: string, externalId: string, unifiedLeagueId: string): Promise<void> {
    const { error } = await this.supabase
      .from('league_mappings')
      .insert({
        source_name: sourceName,
        external_id: externalId,
        unified_league_id: unifiedLeagueId
      });

    if (error) throw new Error(error.message);
  }
}
