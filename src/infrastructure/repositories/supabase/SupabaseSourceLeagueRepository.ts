import { ISourceLeagueRepository, SourceLeague, SourceLeagueQuery, SourceLeagueQueryResult } from "@/src/application/repositories/ISourceLeagueRepository";
import { NormalizedLeague } from "@/src/application/services/IExternalFootballService";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * SupabaseSourceLeagueRepository
 * Persists raw/normalized source league data to Supabase.
 */
export class SupabaseSourceLeagueRepository implements ISourceLeagueRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async query(params: SourceLeagueQuery): Promise<SourceLeagueQueryResult> {
    let q = this.supabase.from('source_leagues').select('*', { count: 'exact' });

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
      data: (data || []).map(this.mapToSourceLeague.bind(this)),
      total: count || 0
    };
  }

  async upsert(league: NormalizedLeague, unifiedLeagueId?: string): Promise<void> {
    const { error } = await this.supabase
      .from('source_leagues')
      .upsert({
        source_name: league.sourceName,
        external_id: league.externalId,
        name: league.name,
        code: league.code,
        country: league.country,
        emblem_url: league.emblemUrl,
        unified_league_id: unifiedLeagueId,
        raw_data: league as any,
        updated_at: new Date().toISOString()
      }, { onConflict: 'source_name, external_id' });

    if (error) throw new Error(error.message);
  }

  async getBySource(sourceName: string, externalId: string): Promise<SourceLeague | null> {
    const { data, error } = await this.supabase
      .from('source_leagues')
      .select('*')
      .eq('source_name', sourceName)
      .eq('external_id', externalId)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data ? this.mapToSourceLeague(data) : null;
  }

  private mapToSourceLeague(row: any): SourceLeague {
    return {
      id: row.id,
      sourceName: row.source_name,
      externalId: row.external_id,
      name: row.name,
      code: row.code,
      country: row.country,
      emblemUrl: row.emblem_url,
      unifiedLeagueId: row.unified_league_id,
      rawData: row.raw_data
    };
  }
}
