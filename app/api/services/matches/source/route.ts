import { NextResponse } from 'next/server';
import { SupabaseSourceMatchRepository } from '@/src/infrastructure/repositories/supabase/SupabaseSourceMatchRepository';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';

/**
 * API Route for Source Match data
 */
export async function POST(request: Request) {
  try {
    const { match, unifiedMatchId } = await request.json();
    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseSourceMatchRepository(supabase);
    await repo.upsert(match, unifiedMatchId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error upserting source match:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source');
  const externalId = searchParams.get('externalId');
  if (!source || !externalId) return NextResponse.json({ error: "Missing params" }, { status: 400 });

  const supabase = createAdminSupabaseClient();
  const repo = new SupabaseSourceMatchRepository(supabase);
  const data = await repo.getBySource(source, externalId);
  if (!data) return NextResponse.json({ error: "NotFound" }, { status: 404 });
  return NextResponse.json(data);
}
