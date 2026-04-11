import { IMatchMappingRepository } from "@/src/application/repositories/IMatchMappingRepository";
import { Database } from "@/src/domain/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * SupabaseMatchMappingRepository
 * Resolves source entities to unified entities using Supabase.
 */
export class SupabaseMatchMappingRepository implements IMatchMappingRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findUnifiedId(sourceName: string, externalId: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('match_mappings')
      .select('unified_match_id')
      .eq('source_name', sourceName)
      .eq('external_id', externalId)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data ? data.unified_match_id : null;
  }

  async createMapping(sourceName: string, externalId: string, unifiedId: string): Promise<void> {
    const { error } = await this.supabase
      .from('match_mappings')
      .insert({
        source_name: sourceName,
        external_id: externalId,
        unified_match_id: unifiedId
      });

    if (error) throw new Error(error.message);
  }
}
