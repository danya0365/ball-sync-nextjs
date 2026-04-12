import { ISourcePlayerRepository, SourcePlayer, SourcePlayerQuery, SourcePlayerQueryResult } from "@/src/application/repositories/ISourcePlayerRepository";
import { NormalizedPlayer } from "@/src/application/services/IExternalFootballService";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * SupabaseSourcePlayerRepository
 * Persists raw/normalized source player data to Supabase.
 */
export class SupabaseSourcePlayerRepository implements ISourcePlayerRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async query(params: SourcePlayerQuery): Promise<SourcePlayerQueryResult> {
    let q = this.supabase.from('source_players').select('*', { count: 'exact' });

    if (params.sourceName) {
      q = q.eq('source_name', params.sourceName);
    }

    if (params.sortBy) {
      q = q.order(params.sortBy, { ascending: params.sortOrder === 'asc' });
    } else {
      q = q.order('name', { ascending: true });
    }

    if (params.pagination) {
      const { limit, offset = 0 } = params.pagination;
      q = q.range(offset, offset + limit - 1);
    }

    const { data, error, count } = await q;
    if (error) throw new Error(error.message);

    return {
      data: (data || []).map(this.mapToSourcePlayer.bind(this)),
      total: count || 0
    };
  }

  async upsert(player: NormalizedPlayer, unifiedPlayerId?: string): Promise<void> {
    const { error } = await this.supabase
      .from('source_players')
      .upsert({
        source_name: player.sourceName,
        external_id: player.externalId,
        name: player.name,
        nationality: player.nationality,
        position: player.position,
        date_of_birth: player.dateOfBirth,
        unified_player_id: unifiedPlayerId,
        raw_data: player as any,
        updated_at: new Date().toISOString()
      }, { onConflict: 'source_name, external_id' });

    if (error) throw new Error(error.message);
  }

  async getBySource(sourceName: string, externalId: string): Promise<SourcePlayer | null> {
    const { data, error } = await this.supabase
      .from('source_players')
      .select('*')
      .eq('source_name', sourceName)
      .eq('external_id', externalId)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data ? this.mapToSourcePlayer(data) : null;
  }

  private mapToSourcePlayer(row: any): SourcePlayer {
    return {
      id: row.id,
      sourceName: row.source_name,
      externalId: row.external_id,
      name: row.name,
      nationality: row.nationality,
      position: row.position,
      dateOfBirth: row.date_of_birth,
      unifiedPlayerId: row.unified_player_id,
      rawData: row.raw_data
    };
  }
}
