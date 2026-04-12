import { NextResponse } from 'next/server';
import { FootballDataOrgService } from '@/src/infrastructure/services/FootballDataOrgService';
import { TheSportsDbService } from '@/src/infrastructure/services/TheSportsDbService';
import { SupabaseUnifiedLeagueRepository } from '@/src/infrastructure/repositories/supabase/SupabaseUnifiedLeagueRepository';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceName = searchParams.get('source');
    
    if (!sourceName) {
      const supabase = createAdminSupabaseClient();
      const repo = new SupabaseUnifiedLeagueRepository(supabase);
      const result = await repo.query({ pagination: { limit: 100 } });
      return NextResponse.json(result.data);
    }

    let leagues: any[] = [];
    if (sourceName === 'football-data.org') {
      const service = new FootballDataOrgService();
      leagues = await service.fetchLeagues();
    } else if (sourceName === 'thesportsdb.com') {
      const service = new TheSportsDbService();
      leagues = await service.fetchLeagues();
    } else {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
    }
    
    return NextResponse.json(leagues);
  } catch (error: any) {
    console.error("Error fetching leagues:", error);
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
