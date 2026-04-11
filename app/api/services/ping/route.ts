import { NextResponse } from 'next/server';
import { FootballDataOrgService } from '@/src/infrastructure/services/FootballDataOrgService';
import { TheSportsDbService } from '@/src/infrastructure/services/TheSportsDbService';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceName = searchParams.get('source');
    
    let isOnline = false;

    // Route ping to the appropriate service
    if (sourceName === 'football-data.org') {
      const service = new FootballDataOrgService();
      isOnline = await service.ping();
    } else if (sourceName === 'thesportsdb.com') {
      const service = new TheSportsDbService();
      isOnline = await service.ping();
    }
    
    return NextResponse.json({ isOnline });
  } catch (error: any) {
    console.error("Error ping:", error);
    return NextResponse.json({ isOnline: false }, { status: 500 });
  }
}
