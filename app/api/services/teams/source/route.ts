import { NextResponse } from 'next/server';
import { SupabaseSourceTeamRepository } from '@/src/infrastructure/repositories/supabase/SupabaseSourceTeamRepository';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceName = searchParams.get('source');
    const externalId = searchParams.get('externalId');
    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseSourceTeamRepository(supabase);

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
    const { team, unifiedTeamId } = await request.json();
    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseSourceTeamRepository(supabase);
    await repo.upsert(team, unifiedTeamId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
