import { NextResponse } from 'next/server';
import { FootballDataOrgService } from '@/src/infrastructure/services/FootballDataOrgService';
import { TheSportsDbService } from '@/src/infrastructure/services/TheSportsDbService';
import { SupabaseUnifiedTeamRepository } from '@/src/infrastructure/repositories/supabase/SupabaseUnifiedTeamRepository';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceName = searchParams.get('source');
    
    if (!sourceName) {
      const supabase = createAdminSupabaseClient();
      const repo = new SupabaseUnifiedTeamRepository(supabase);
      const result = await repo.query({ pagination: { limit: 100 } });
      return NextResponse.json(result.data);
    }

    let teams: any[] = [];
    if (sourceName === 'football-data.org') {
      const service = new FootballDataOrgService();
      teams = await service.fetchTeams();
    } else if (sourceName === 'thesportsdb.com') {
      const service = new TheSportsDbService();
      teams = await service.fetchTeams();
    } else {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
    }
    
    return NextResponse.json(teams);
  } catch (error: any) {
    console.error("Error fetching teams:", error);
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
