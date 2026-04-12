import { NextResponse } from 'next/server';
import { SupabaseTeamMappingRepository } from '@/src/infrastructure/repositories/supabase/SupabaseTeamMappingRepository';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || '';
    const externalId = searchParams.get('externalId') || '';
    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseTeamMappingRepository(supabase);
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
    const repo = new SupabaseTeamMappingRepository(supabase);
    await repo.createMapping(body.source_name, body.external_id, body.unified_team_id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
