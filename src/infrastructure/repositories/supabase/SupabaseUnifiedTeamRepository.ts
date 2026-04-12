import { IUnifiedTeamRepository, UnifiedTeam, UnifiedTeamQuery, UnifiedTeamQueryResult } from "@/src/application/repositories/IUnifiedTeamRepository";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * SupabaseUnifiedTeamRepository
 * Manages the "Golden Record" for Teams in Supabase.
 */
export class SupabaseUnifiedTeamRepository implements IUnifiedTeamRepository {

  constructor(private readonly supabase: SupabaseClient) {}

  async query(params: UnifiedTeamQuery): Promise<UnifiedTeamQueryResult> {
    let q = this.supabase.from('unified_teams').select('*', { count: 'exact' });

    if (params.filters) {
      if (params.filters.country) {
        q = q.eq('country', params.filters.country);
      }
      if (params.filters.isApproved !== undefined) {
        q = q.eq('is_approved', params.filters.isApproved);
      }
    }

    if (params.search) {
      q = q.or(`name_en.ilike.%${params.search}%,short_name.ilike.%${params.search}%`);
    }

    const sortBy = params.sortBy || 'name_en';
    const ascending = params.sortOrder === 'asc';
    q = q.order(sortBy, { ascending });

    if (params.pagination) {
      const limit = params.pagination.limit;
      const offset = params.pagination.offset || 0;
      q = q.range(offset, offset + limit - 1);
    }

    const { data, error, count } = await q;
    if (error) throw new Error(error.message);

    return {
      data: (data || []).map(this.mapToUnifiedTeam.bind(this)),
      total: count || 0
    };
  }

  async getById(id: string): Promise<UnifiedTeam | null> {
    const { data, error } = await this.supabase
      .from('unified_teams')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data ? this.mapToUnifiedTeam(data) : null;
  }

  async approveRecord(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('unified_teams')
      .update({ is_approved: true, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw new Error(`Approve Team Error: ${error.message}`);
    return true;
  }

  async mergeRecords(primaryId: string, duplicateId: string): Promise<boolean> {
    const { error: sourceError } = await this.supabase
      .from('source_teams')
      .update({ unified_team_id: primaryId })
      .eq('unified_team_id', duplicateId);
    
    if (sourceError) throw new Error(`Merge Error (Update Sources): ${sourceError.message}`);

    const { error: deleteError } = await this.supabase
      .from('unified_teams')
      .delete()
      .eq('id', duplicateId);
      
    if (deleteError) throw new Error(`Merge Error (Delete Duplicate): ${deleteError.message}`);

    const { error: approveError } = await this.supabase
      .from('unified_teams')
      .update({ is_approved: true, updated_at: new Date().toISOString() })
      .eq('id', primaryId);

    if (approveError) throw new Error(`Merge Error (Approve Primary): ${approveError.message}`);
    return true;
  }

  async upsert(team: Partial<UnifiedTeam>): Promise<UnifiedTeam> {
    const payload: Record<string, unknown> = {
      name_en: team.nameEn,
      name_th: team.nameTh,
      short_name: team.shortName,
      tla: team.tla,
      country: team.country,
      crest_url: team.crestUrl,
      founded_year: team.foundedYear,
      venue_name: team.venueName,
      website: team.website,
      last_updated_by_source: team.lastUpdatedBySource,
      is_approved: team.isApproved,
      updated_at: new Date().toISOString()
    };

    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) delete payload[key];
    });

    if (team.id) {
      const { data, error } = await this.supabase
        .from('unified_teams')
        .update(payload)
        .eq('id', team.id)
        .select()
        .single();

      if (error) throw new Error(`Unified Team Update Error: ${error.message}`);
      return this.mapToUnifiedTeam(data);
    } else {
      const { data, error } = await this.supabase
        .from('unified_teams')
        .insert(payload)
        .select()
        .single();

      if (error) throw new Error(`Unified Team Insert Error: ${error.message}`);
      return this.mapToUnifiedTeam(data);
    }
  }

  private mapToUnifiedTeam(row: any): UnifiedTeam {
    return {
      id: row.id,
      nameEn: row.name_en,
      nameTh: row.name_th ?? undefined,
      shortName: row.short_name ?? undefined,
      tla: row.tla ?? undefined,
      country: row.country ?? undefined,
      crestUrl: row.crest_url ?? undefined,
      foundedYear: row.founded_year ?? undefined,
      venueName: row.venue_name ?? undefined,
      website: row.website ?? undefined,
      lastUpdatedBySource: row.last_updated_by_source || 'Unknown',
      isApproved: row.is_approved || false,
      updatedAt: row.updated_at || new Date().toISOString()
    };
  }
}
