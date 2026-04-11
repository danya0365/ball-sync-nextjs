import { IUnifiedMatchRepository, UnifiedMatch } from "@/src/application/repositories/IUnifiedMatchRepository";
import { Database } from "@/src/domain/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * SupabaseUnifiedMatchRepository
 * Manages the "Golden Record" in Supabase.
 */
export class SupabaseUnifiedMatchRepository implements IUnifiedMatchRepository {

  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getAll(): Promise<UnifiedMatch[]> {
    const { data, error } = await this.supabase
      .from('unified_matches')
      .select('*')
      .order('match_date', { ascending: true });
    
    if (error) throw new Error(error.message);
    return (data || []).map(this.mapToUnifiedMatch);
  }

  async getById(id: string): Promise<UnifiedMatch | null> {
    const { data, error } = await this.supabase
      .from('unified_matches')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data ? this.mapToUnifiedMatch(data) : null;
  }

  async upsert(match: Partial<UnifiedMatch>): Promise<UnifiedMatch> {
    const payload: any = {
      league_name_en: match.leagueNameEn,
      league_name_th: match.leagueNameTh,
      home_team_name_en: match.homeTeamNameEn,
      home_team_name_th: match.homeTeamNameTh,
      away_team_name_en: match.awayTeamNameEn,
      away_team_name_th: match.awayTeamNameTh,
      match_date: match.matchDate,
      status: match.status,
      home_score: match.score?.home,
      away_score: match.score?.away,
      half_time_home: match.score?.halfTimeHome,
      half_time_away: match.score?.halfTimeAway,
      last_updated_by_source: match.lastUpdatedBySource,
      updated_at: new Date().toISOString()
    };

    if (match.id) payload.id = match.id;

    const { data, error } = await this.supabase
      .from('unified_matches')
      .upsert(payload, { onConflict: match.id ? 'id' : undefined })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToUnifiedMatch(data);
  }

  private mapToUnifiedMatch(row: any): UnifiedMatch {
    return {
      id: row.id,
      leagueNameEn: row.league_name_en,
      leagueNameTh: row.league_name_th,
      homeTeamNameEn: row.home_team_name_en,
      homeTeamNameTh: row.home_team_name_th,
      awayTeamNameEn: row.away_team_name_en,
      awayTeamNameTh: row.away_team_name_th,
      matchDate: row.match_date,
      status: row.status,
      score: {
        home: row.home_score,
        away: row.away_score,
        halfTimeHome: row.half_time_home,
        halfTimeAway: row.half_time_away
      },
      lastUpdatedBySource: row.last_updated_by_source,
      updatedAt: row.updated_at
    };
  }
}
