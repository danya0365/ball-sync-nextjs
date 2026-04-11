import { IMatchRepository } from "@/src/application/repositories/IMatchRepository";
import { NormalizedMatch } from "@/src/application/services/IExternalFootballService";
import { Database } from "@/src/domain/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * SupabaseMatchRepository
 * Supabase implementation for Match persistence
 * Following Clean Architecture - Infrastructure layer
 * Note: Deprecated in favor of SupabaseSourceMatchRepository and SupabaseUnifiedMatchRepository
 */
export class SupabaseMatchRepository implements IMatchRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getMatches(status?: string): Promise<NormalizedMatch[]> {
    let query = this.supabase.from('source_matches').select('*'); // redirect to source_matches as fallback, or just keep 'matches' if the table exists
    if (status) query = query.eq('status', status);
    
    // We will just cast since this is deprecated
    const { data, error } = await query as any;
    if (error) throw new Error((error as any).message);
    
    return (data || []).map(this.mapToNormalizedMatch);
  }

  async upsertMany(matches: NormalizedMatch[]): Promise<void> {
    if (matches.length === 0) return;

    const payload = matches.map(m => ({
      external_id: m.externalId,
      source_name: m.sourceName,
      home_team_name: m.homeTeam,
      away_team_name: m.awayTeam,
      match_date: m.matchDate,
      status: m.status,
      home_score: m.score.home,
      away_score: m.score.away,
      half_time_home: m.score.halfTimeHome,
      half_time_away: m.score.halfTimeAway,
      updated_at: new Date().toISOString()
    }));

    const { error } = await this.supabase
      .from('source_matches' as any) // suppress error if 'matches' doesn't exist
      .upsert(payload as any, { onConflict: 'external_id' } as any);

    if (error) throw new Error((error as any).message);
  }

  async getByExternalId(externalId: string): Promise<NormalizedMatch | null> {
    const { data, error } = await this.supabase
      .from('source_matches' as any)
      .select('*')
      .eq('external_id', externalId)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    if (!data) return null;

    return this.mapToNormalizedMatch(data);
  }

  private mapToNormalizedMatch(row: any): NormalizedMatch {
    return {
      externalId: row.external_id,
      sourceName: row.source_name,
      homeTeam: row.home_team_name,
      awayTeam: row.away_team_name,
      matchDate: row.match_date,
      status: row.status,
      score: {
        home: row.home_score,
        away: row.away_score,
        halfTimeHome: row.half_time_home,
        halfTimeAway: row.half_time_away
      }
    };
  }
}
