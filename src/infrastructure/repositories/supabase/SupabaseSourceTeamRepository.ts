import { ISourceTeamRepository, SourceTeam, SourceTeamQuery, SourceTeamQueryResult } from "@/src/application/repositories/ISourceTeamRepository";
import { NormalizedTeam } from "@/src/application/services/IExternalFootballService";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * SupabaseSourceTeamRepository
 * Persists raw/normalized source team data to Supabase.
 */
export class SupabaseSourceTeamRepository implements ISourceTeamRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async query(params: SourceTeamQuery): Promise<SourceTeamQueryResult> {
    let q = this.supabase.from('source_teams').select('*', { count: 'exact' });

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
      data: (data || []).map(this.mapToSourceTeam.bind(this)),
      total: count || 0
    };
  }

  async upsert(team: NormalizedTeam, unifiedTeamId?: string): Promise<void> {
    const { error } = await this.supabase
      .from('source_teams')
      .upsert({
        source_name: team.sourceName,
        external_id: team.externalId,
        name: team.name,
        short_name: team.shortName,
        country: team.country,
        crest_url: team.crestUrl,
        unified_team_id: unifiedTeamId,
        raw_data: team as any,
        updated_at: new Date().toISOString()
      }, { onConflict: 'source_name, external_id' });

    if (error) throw new Error(error.message);
  }

  async getBySource(sourceName: string, externalId: string): Promise<SourceTeam | null> {
    const { data, error } = await this.supabase
      .from('source_teams')
      .select('*')
      .eq('source_name', sourceName)
      .eq('external_id', externalId)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data ? this.mapToSourceTeam(data) : null;
  }

  private mapToSourceTeam(row: any): SourceTeam {
    return {
      id: row.id,
      sourceName: row.source_name,
      externalId: row.external_id,
      name: row.name,
      shortName: row.short_name,
      country: row.country,
      crestUrl: row.crest_url,
      unifiedTeamId: row.unified_team_id,
      rawData: row.raw_data
    };
  }
}
