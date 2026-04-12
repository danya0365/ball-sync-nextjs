import { IUnifiedPlayerRepository, UnifiedPlayer, UnifiedPlayerQuery, UnifiedPlayerQueryResult } from "@/src/application/repositories/IUnifiedPlayerRepository";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * SupabaseUnifiedPlayerRepository
 * Manages the "Golden Record" for Players in Supabase.
 */
export class SupabaseUnifiedPlayerRepository implements IUnifiedPlayerRepository {

  constructor(private readonly supabase: SupabaseClient) {}

  async query(params: UnifiedPlayerQuery): Promise<UnifiedPlayerQueryResult> {
    let q = this.supabase.from('unified_players').select('*', { count: 'exact' });

    if (params.filters) {
      if (params.filters.teamId) {
        q = q.eq('team_id', params.filters.teamId);
      }
      if (params.filters.nationality) {
        q = q.eq('nationality', params.filters.nationality);
      }
      if (params.filters.position) {
        q = q.eq('position', params.filters.position);
      }
      if (params.filters.isApproved !== undefined) {
        q = q.eq('is_approved', params.filters.isApproved);
      }
    }

    if (params.search) {
      q = q.or(`name_en.ilike.%${params.search}%`);
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
      data: (data || []).map(this.mapToUnifiedPlayer.bind(this)),
      total: count || 0
    };
  }

  async getById(id: string): Promise<UnifiedPlayer | null> {
    const { data, error } = await this.supabase
      .from('unified_players')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data ? this.mapToUnifiedPlayer(data) : null;
  }

  async approveRecord(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('unified_players')
      .update({ is_approved: true, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw new Error(`Approve Player Error: ${error.message}`);
    return true;
  }

  async mergeRecords(primaryId: string, duplicateId: string): Promise<boolean> {
    const { error: sourceError } = await this.supabase
      .from('source_players')
      .update({ unified_player_id: primaryId })
      .eq('unified_player_id', duplicateId);
    
    if (sourceError) throw new Error(`Merge Error (Update Sources): ${sourceError.message}`);

    const { error: deleteError } = await this.supabase
      .from('unified_players')
      .delete()
      .eq('id', duplicateId);
      
    if (deleteError) throw new Error(`Merge Error (Delete Duplicate): ${deleteError.message}`);

    const { error: approveError } = await this.supabase
      .from('unified_players')
      .update({ is_approved: true, updated_at: new Date().toISOString() })
      .eq('id', primaryId);

    if (approveError) throw new Error(`Merge Error (Approve Primary): ${approveError.message}`);
    return true;
  }

  async upsert(player: Partial<UnifiedPlayer>): Promise<UnifiedPlayer> {
    const payload: Record<string, unknown> = {
      name_en: player.nameEn,
      name_th: player.nameTh,
      nationality: player.nationality,
      position: player.position,
      date_of_birth: player.dateOfBirth,
      shirt_number: player.shirtNumber,
      team_id: player.teamId,
      photo_url: player.photoUrl,
      last_updated_by_source: player.lastUpdatedBySource,
      is_approved: player.isApproved,
      updated_at: new Date().toISOString()
    };

    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) delete payload[key];
    });

    if (player.id) {
      const { data, error } = await this.supabase
        .from('unified_players')
        .update(payload)
        .eq('id', player.id)
        .select()
        .single();

      if (error) throw new Error(`Unified Player Update Error: ${error.message}`);
      return this.mapToUnifiedPlayer(data);
    } else {
      const { data, error } = await this.supabase
        .from('unified_players')
        .insert(payload)
        .select()
        .single();

      if (error) throw new Error(`Unified Player Insert Error: ${error.message}`);
      return this.mapToUnifiedPlayer(data);
    }
  }

  private mapToUnifiedPlayer(row: any): UnifiedPlayer {
    return {
      id: row.id,
      nameEn: row.name_en,
      nameTh: row.name_th ?? undefined,
      nationality: row.nationality ?? undefined,
      position: row.position ?? undefined,
      dateOfBirth: row.date_of_birth ?? undefined,
      shirtNumber: row.shirt_number ?? undefined,
      teamId: row.team_id ?? undefined,
      photoUrl: row.photo_url ?? undefined,
      lastUpdatedBySource: row.last_updated_by_source || 'Unknown',
      isApproved: row.is_approved || false,
      updatedAt: row.updated_at || new Date().toISOString()
    };
  }
}
