import { NextResponse } from 'next/server';
import { SupabaseUnifiedLeagueRepository } from '@/src/infrastructure/repositories/supabase/SupabaseUnifiedLeagueRepository';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseUnifiedLeagueRepository(supabase);

    const params: any = {};
    const filters: any = {};
    if (searchParams.get('country')) filters.country = searchParams.get('country');
    if (searchParams.get('type')) filters.type = searchParams.get('type');
    if (searchParams.get('isApproved')) filters.isApproved = searchParams.get('isApproved') === 'true';
    if (Object.keys(filters).length) params.filters = filters;
    if (searchParams.get('search')) params.search = searchParams.get('search');
    if (searchParams.get('sortBy')) params.sortBy = searchParams.get('sortBy');
    if (searchParams.get('sortOrder')) params.sortOrder = searchParams.get('sortOrder');

    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    params.pagination = { limit, offset };

    const result = await repo.query(params);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseUnifiedLeagueRepository(supabase);
    const result = await repo.upsert(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();
    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseUnifiedLeagueRepository(supabase);
    await repo.approveRecord(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
