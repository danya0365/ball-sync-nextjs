import { ITeamMappingRepository } from "@/src/application/repositories/ITeamMappingRepository";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * SupabaseTeamMappingRepository
 * Resolves source teams to unified teams using Supabase.
 */
export class SupabaseTeamMappingRepository implements ITeamMappingRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findUnifiedId(sourceName: string, externalId: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('team_mappings')
      .select('unified_team_id')
      .eq('source_name', sourceName)
      .eq('external_id', externalId)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data ? data.unified_team_id : null;
  }

  async createMapping(sourceName: string, externalId: string, unifiedTeamId: string): Promise<void> {
    const { error } = await this.supabase
      .from('team_mappings')
      .insert({
        source_name: sourceName,
        external_id: externalId,
        unified_team_id: unifiedTeamId
      });

    if (error) throw new Error(error.message);
  }
}
