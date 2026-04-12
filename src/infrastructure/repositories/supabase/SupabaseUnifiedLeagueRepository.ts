import { IUnifiedLeagueRepository, UnifiedLeague, UnifiedLeagueQuery, UnifiedLeagueQueryResult } from "@/src/application/repositories/IUnifiedLeagueRepository";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * SupabaseUnifiedLeagueRepository
 * Manages the "Golden Record" for Leagues in Supabase.
 */
export class SupabaseUnifiedLeagueRepository implements IUnifiedLeagueRepository {

  constructor(private readonly supabase: SupabaseClient) {}

  async query(params: UnifiedLeagueQuery): Promise<UnifiedLeagueQueryResult> {
    let q = this.supabase.from('unified_leagues').select('*', { count: 'exact' });

    if (params.filters) {
      if (params.filters.country) {
        q = q.eq('country', params.filters.country);
      }
      if (params.filters.type) {
        q = q.eq('type', params.filters.type);
      }
      if (params.filters.isApproved !== undefined) {
        q = q.eq('is_approved', params.filters.isApproved);
      }
    }

    if (params.search) {
      q = q.or(`name_en.ilike.%${params.search}%,code.ilike.%${params.search}%`);
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
      data: (data || []).map(this.mapToUnifiedLeague.bind(this)),
      total: count || 0
    };
  }

  async getById(id: string): Promise<UnifiedLeague | null> {
    const { data, error } = await this.supabase
      .from('unified_leagues')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data ? this.mapToUnifiedLeague(data) : null;
  }

  async approveRecord(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('unified_leagues')
      .update({ is_approved: true, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw new Error(`Approve League Error: ${error.message}`);
    return true;
  }

  async mergeRecords(primaryId: string, duplicateId: string): Promise<boolean> {
    const { error: sourceError } = await this.supabase
      .from('source_leagues')
      .update({ unified_league_id: primaryId })
      .eq('unified_league_id', duplicateId);
    
    if (sourceError) throw new Error(`Merge Error (Update Sources): ${sourceError.message}`);

    const { error: deleteError } = await this.supabase
      .from('unified_leagues')
      .delete()
      .eq('id', duplicateId);
      
    if (deleteError) throw new Error(`Merge Error (Delete Duplicate): ${deleteError.message}`);

    const { error: approveError } = await this.supabase
      .from('unified_leagues')
      .update({ is_approved: true, updated_at: new Date().toISOString() })
      .eq('id', primaryId);

    if (approveError) throw new Error(`Merge Error (Approve Primary): ${approveError.message}`);
    return true;
  }

  async upsert(league: Partial<UnifiedLeague>): Promise<UnifiedLeague> {
    const payload: Record<string, unknown> = {
      name_en: league.nameEn,
      name_th: league.nameTh,
      code: league.code,
      country: league.country,
      emblem_url: league.emblemUrl,
      type: league.type,
      current_season: league.currentSeason,
      last_updated_by_source: league.lastUpdatedBySource,
      is_approved: league.isApproved,
      updated_at: new Date().toISOString()
    };

    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) delete payload[key];
    });

    if (league.id) {
      const { data, error } = await this.supabase
        .from('unified_leagues')
        .update(payload)
        .eq('id', league.id)
        .select()
        .single();

      if (error) throw new Error(`Unified League Update Error: ${error.message}`);
      return this.mapToUnifiedLeague(data);
    } else {
      const { data, error } = await this.supabase
        .from('unified_leagues')
        .insert(payload)
        .select()
        .single();

      if (error) throw new Error(`Unified League Insert Error: ${error.message}`);
      return this.mapToUnifiedLeague(data);
    }
  }

  private mapToUnifiedLeague(row: any): UnifiedLeague {
    return {
      id: row.id,
      nameEn: row.name_en,
      nameTh: row.name_th ?? undefined,
      code: row.code ?? undefined,
      country: row.country ?? undefined,
      emblemUrl: row.emblem_url ?? undefined,
      type: row.type || 'LEAGUE',
      currentSeason: row.current_season ?? undefined,
      lastUpdatedBySource: row.last_updated_by_source || 'Unknown',
      isApproved: row.is_approved || false,
      updatedAt: row.updated_at || new Date().toISOString()
    };
  }
}
