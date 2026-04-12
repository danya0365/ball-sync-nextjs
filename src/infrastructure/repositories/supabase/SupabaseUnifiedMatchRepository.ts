import { IUnifiedMatchRepository, UnifiedMatch, UnifiedMatchQuery, UnifiedMatchQueryResult } from "@/src/application/repositories/IUnifiedMatchRepository";
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

  async query(params: UnifiedMatchQuery): Promise<UnifiedMatchQueryResult> {
    let q = this.supabase.from('unified_matches').select('*', { count: 'exact' });

    // 1. Filters
    if (params.filters) {
      if (params.filters.status) {
        const statuses = Array.isArray(params.filters.status) ? params.filters.status : [params.filters.status];
        q = q.in('status', statuses as Database['public']['Enums']['match_status'][]);
      }
      if (params.filters.isApproved !== undefined) {
        q = q.eq('is_approved', params.filters.isApproved);
      }
    }

    // 2. Date Range
    if (params.dateRange) {
      q = q.gte('match_date', params.dateRange.startDate)
           .lte('match_date', params.dateRange.endDate);
    }

    // 3. Search (Search across team names locally with ilike)
    if (params.search) {
      q = q.or(`home_team_name_en.ilike.%${params.search}%,away_team_name_en.ilike.%${params.search}%`);
    }

    // 4. Sort
    const sortBy = params.sortBy || 'match_date';
    const ascending = params.sortOrder === 'asc';
    q = q.order(sortBy, { ascending });

    // 5. Pagination
    if (params.pagination) {
      const limit = params.pagination.limit;
      const offset = params.pagination.offset || 0;
      q = q.range(offset, offset + limit - 1);
    }

    const { data, error, count } = await q;

    if (error) throw new Error(error.message);

    return {
      data: (data || []).map(this.mapToUnifiedMatch.bind(this)),
      total: count || 0
    };
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

  async approveMatch(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('unified_matches')
      .update({ is_approved: true, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw new Error(`Approve Match Error: ${error.message}`);
    return true;
  }

  async mergeMatches(primaryId: string, duplicateId: string): Promise<boolean> {
    // 1. Move all source linkages from Duplicate to Primary
    const { error: sourceError } = await this.supabase
      .from('source_matches')
      .update({ unified_match_id: primaryId })
      .eq('unified_match_id', duplicateId);
    
    if (sourceError) throw new Error(`Merge Error (Update Sources): ${sourceError.message}`);

    // 2. Erase the Duplicate from Unified Matches
    const { error: deleteError } = await this.supabase
      .from('unified_matches')
      .delete()
      .eq('id', duplicateId);
      
    if (deleteError) throw new Error(`Merge Error (Delete Duplicate): ${deleteError.message}`);

    // 3. Mark Primary as Approved
    const { error: approveError } = await this.supabase
      .from('unified_matches')
      .update({ is_approved: true, updated_at: new Date().toISOString() })
      .eq('id', primaryId);

    if (approveError) throw new Error(`Merge Error (Approve Primary): ${approveError.message}`);

    return true;
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
      extra_time_home: match.score?.extraTimeHome,
      extra_time_away: match.score?.extraTimeAway,
      penalties_home: match.score?.penaltiesHome,
      penalties_away: match.score?.penaltiesAway,
      match_stage: match.matchStage,
      group_name: match.groupName,
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
      matchStage: row.match_stage ?? undefined,
      groupName: row.group_name ?? undefined,
      score: {
        home: row.home_score,
        away: row.away_score,
        halfTimeHome: row.half_time_home ?? undefined,
        halfTimeAway: row.half_time_away ?? undefined,
        extraTimeHome: row.extra_time_home ?? undefined,
        extraTimeAway: row.extra_time_away ?? undefined,
        penaltiesHome: row.penalties_home ?? undefined,
        penaltiesAway: row.penalties_away ?? undefined
      },
      lastUpdatedBySource: row.last_updated_by_source || 'Unknown',
      isApproved: row.is_approved || false,
      updatedAt: row.updated_at || new Date().toISOString()
    };
  }
}
