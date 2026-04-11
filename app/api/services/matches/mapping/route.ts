import { NextResponse } from 'next/server';
import { SupabaseMatchMappingRepository } from '@/src/infrastructure/repositories/supabase/SupabaseMatchMappingRepository';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';

/**
 * API Route for Entity Mapping
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const externalId = searchParams.get('externalId');
    if (!source || !externalId) return NextResponse.json({ error: "Missing params" }, { status: 400 });
    
    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseMatchMappingRepository(supabase);
    const unifiedId = await repo.findUnifiedId(source, externalId);
    if (!unifiedId) return NextResponse.json({ error: "NotFound" }, { status: 404 });
    return NextResponse.json({ unifiedId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { source_name, external_id, unified_match_id } = await request.json();
    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseMatchMappingRepository(supabase);
    await repo.createMapping(source_name, external_id, unified_match_id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error creating mapping:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
