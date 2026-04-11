import { NextResponse } from 'next/server';
import { SupabaseUnifiedMatchRepository } from '@/src/infrastructure/repositories/supabase/SupabaseUnifiedMatchRepository';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';

/**
 * API Route for Unified Match (Golden Record)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseUnifiedMatchRepository(supabase);
    
    if (startDate && endDate) {
      const data = await repo.findMatchesByDateRange(startDate, endDate);
      return NextResponse.json(data);
    } else {
      const data = await repo.getAll();
      return NextResponse.json(data);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const match = await request.json();
    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseUnifiedMatchRepository(supabase);
    const data = await repo.upsert(match);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error upserting unified match:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
