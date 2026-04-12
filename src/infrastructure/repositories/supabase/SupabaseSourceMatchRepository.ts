import { ISourceMatchRepository } from "@/src/application/repositories/ISourceMatchRepository";
import { NormalizedMatch } from "@/src/application/services/IExternalFootballService";
import { Database } from "@/src/domain/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * SupabaseSourceMatchRepository
 * Persists raw/normalized source data to Supabase.
 */
export class SupabaseSourceMatchRepository implements ISourceMatchRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async query(params: import("@/src/application/repositories/ISourceMatchRepository").SourceMatchQuery): Promise<import("@/src/application/repositories/ISourceMatchRepository").SourceMatchQueryResult> {
    let q = this.supabase.from('source_matches').select('*', { count: 'exact' });

    if (params.sourceName) {
      q = q.eq('source_name', params.sourceName);
    }

    if (params.sortBy) {
      q = q.order(params.sortBy, { ascending: params.sortOrder === 'asc' });
    } else {
      q = q.order('match_date', { ascending: false });
    }

    if (params.pagination) {
      const { limit, offset = 0 } = params.pagination;
      q = q.range(offset, offset + limit - 1);
    }

    const { data, error, count } = await q;

    if (error) throw new Error(error.message);

    return {
      data: (data || []).map(this.mapToSourceMatch.bind(this)),
      total: count || 0
    };
  }

  async upsert(match: NormalizedMatch, unifiedMatchId?: string): Promise<void> {
    const { error } = await this.supabase
      .from('source_matches')
      .upsert({
        source_name: match.sourceName,
        external_id: match.externalId,
        home_team_name: match.homeTeam,
        away_team_name: match.awayTeam,
        match_date: match.matchDate,
        status: match.status,
        home_score: match.score.home,
        away_score: match.score.away,
        half_time_home: match.score.halfTimeHome,
        half_time_away: match.score.halfTimeAway,
        unified_match_id: unifiedMatchId,
        raw_data: match as any,
        updated_at: new Date().toISOString()
      }, { onConflict: 'source_name, external_id' });

    if (error) throw new Error(error.message);
  }

  async getBySource(sourceName: string, externalId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('source_matches')
      .select('*')
      .eq('source_name', sourceName)
      .eq('external_id', externalId)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data ? this.mapToSourceMatch(data) : null;
  }

  private mapToSourceMatch(row: any): import("@/src/application/repositories/ISourceMatchRepository").SourceMatch {
    return {
      id: row.id,
      sourceName: row.source_name,
      externalId: row.external_id,
      homeTeamName: row.home_team_name,
      awayTeamName: row.away_team_name,
      matchDate: row.match_date,
      status: row.status,
      unifiedMatchId: row.unified_match_id,
      rawData: row.raw_data
    };
  }
}
