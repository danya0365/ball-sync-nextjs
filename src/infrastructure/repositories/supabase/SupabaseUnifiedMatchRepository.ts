import { IUnifiedMatchRepository, UnifiedMatch } from "@/src/application/repositories/IUnifiedMatchRepository";
import { Database } from "@/src/domain/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

type UnifiedMatchRow = Database['public']['Tables']['unified_matches']['Row'];
type UnifiedMatchInsert = Database['public']['Tables']['unified_matches']['Insert'];
type UnifiedMatchUpdate = Database['public']['Tables']['unified_matches']['Update'];

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

  async findMatchesByDateRange(startDate: string, endDate: string): Promise<UnifiedMatch[]> {
    const { data, error } = await this.supabase
      .from('unified_matches')
      .select('*')
      .gte('match_date', startDate)
      .lte('match_date', endDate)
      .order('match_date', { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []).map(this.mapToUnifiedMatch.bind(this));
  }

  async upsert(match: Partial<UnifiedMatch>): Promise<UnifiedMatch> {
    const payload: UnifiedMatchUpdate = {
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
      is_approved: match.isApproved,
      updated_at: new Date().toISOString()
    };

    // Remove undefined properties so they don't overwrite or cause PG issues
    Object.keys(payload).forEach(key => {
      if ((payload as Record<string, unknown>)[key] === undefined) {
        delete (payload as Record<string, unknown>)[key];
      }
    });

    if (match.id) {
      // Explictly use .update() to avoid "missing NOT NULL" issues on UPSERT for omitted fields
      const { data, error } = await this.supabase
        .from('unified_matches')
        .update(payload)
        .eq('id', match.id)
        .select()
        .single();

      if (error) throw new Error(`Unified Update Error: ${error.message}`);
      return this.mapToUnifiedMatch(data);
    } else {
      // Explicitly use .insert() for a brand new record
      const { data, error } = await this.supabase
        .from('unified_matches')
        .insert(payload as UnifiedMatchInsert)
        .select()
        .single();

      if (error) throw new Error(`Unified Insert Error: ${error.message}`);
      return this.mapToUnifiedMatch(data);
    }
  }

  private mapToUnifiedMatch(row: UnifiedMatchRow): UnifiedMatch {
    return {
      id: row.id,
      leagueNameEn: row.league_name_en ?? undefined,
      leagueNameTh: row.league_name_th ?? undefined,
      homeTeamNameEn: row.home_team_name_en,
      homeTeamNameTh: row.home_team_name_th ?? undefined,
      awayTeamNameEn: row.away_team_name_en,
      awayTeamNameTh: row.away_team_name_th ?? undefined,
      matchDate: row.match_date,
      status: row.status,
      score: {
        home: row.home_score,
        away: row.away_score,
        halfTimeHome: row.half_time_home ?? undefined,
        halfTimeAway: row.half_time_away ?? undefined
      },
      lastUpdatedBySource: row.last_updated_by_source || 'Unknown',
      isApproved: row.is_approved || false,
      updatedAt: row.updated_at || new Date().toISOString()
    };
  }
}
