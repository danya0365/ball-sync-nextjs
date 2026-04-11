import { NextResponse } from 'next/server';
import { FootballDataOrgService } from '@/src/infrastructure/services/FootballDataOrgService';
import { TheSportsDbService } from '@/src/infrastructure/services/TheSportsDbService';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceName = searchParams.get('source');
    
    let matches: any[] = [];

    // Route fetch to the appropriate service
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
