import { NextResponse } from 'next/server';
import { SupabaseUnifiedPlayerRepository } from '@/src/infrastructure/repositories/supabase/SupabaseUnifiedPlayerRepository';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseUnifiedPlayerRepository(supabase);

    const params: any = {};
    const filters: any = {};
    if (searchParams.get('teamId')) filters.teamId = searchParams.get('teamId');
    if (searchParams.get('nationality')) filters.nationality = searchParams.get('nationality');
    if (searchParams.get('position')) filters.position = searchParams.get('position');
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
    const repo = new SupabaseUnifiedPlayerRepository(supabase);
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
    const repo = new SupabaseUnifiedPlayerRepository(supabase);
    await repo.approveRecord(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
