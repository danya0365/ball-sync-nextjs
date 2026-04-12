import { NextResponse } from 'next/server';
import { FootballDataOrgService } from '@/src/infrastructure/services/FootballDataOrgService';
import { TheSportsDbService } from '@/src/infrastructure/services/TheSportsDbService';
import { SupabaseUnifiedMatchRepository } from '@/src/infrastructure/repositories/supabase/SupabaseUnifiedMatchRepository';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceName = searchParams.get('source');
    
    // Default: Return the Unified "Golden Record" from the central DB
    if (!sourceName) {
      const supabase = createAdminSupabaseClient();
      const repo = new SupabaseUnifiedMatchRepository(supabase);
      const result = await repo.query({ pagination: { limit: 100 } });
      return NextResponse.json(result.data);
    }

    // If source specified, fetch raw data from external service
    let matches: any[] = [];
    if (sourceName === 'football-data.org') {
      const service = new FootballDataOrgService();
      matches = await service.fetchLiveMatches();
    } else if (sourceName === 'thesportsdb.com') {
      const service = new TheSportsDbService();
      matches = await service.fetchLiveMatches();
    } else {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
    }
    
    return NextResponse.json(matches);
  } catch (error: any) {
    console.error("Error fetching matches:", error);
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}

// Note: POST is now handled through specific aggregator sub-routes (source, mapping, unified)
// requested by the SyncUseCase or client repositories.
