import { NextResponse } from 'next/server';
import { SupabaseLeagueMappingRepository } from '@/src/infrastructure/repositories/supabase/SupabaseLeagueMappingRepository';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || '';
    const externalId = searchParams.get('externalId') || '';
    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseLeagueMappingRepository(supabase);
    const unifiedId = await repo.findUnifiedId(source, externalId);
    if (!unifiedId) return NextResponse.json({ unifiedId: null }, { status: 404 });
    return NextResponse.json({ unifiedId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseLeagueMappingRepository(supabase);
    await repo.createMapping(body.source_name, body.external_id, body.unified_league_id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
