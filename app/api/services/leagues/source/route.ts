import { NextResponse } from 'next/server';
import { SupabaseSourceLeagueRepository } from '@/src/infrastructure/repositories/supabase/SupabaseSourceLeagueRepository';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceName = searchParams.get('source');
    const externalId = searchParams.get('externalId');
    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseSourceLeagueRepository(supabase);

    if (sourceName && externalId) {
      const result = await repo.getBySource(sourceName, externalId);
      return result ? NextResponse.json(result) : NextResponse.json(null, { status: 404 });
    }

    const result = await repo.query({ pagination: { limit: 100 } });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { league, unifiedLeagueId } = await request.json();
    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseSourceLeagueRepository(supabase);
    await repo.upsert(league, unifiedLeagueId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
