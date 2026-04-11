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
    return data;
  }
}
