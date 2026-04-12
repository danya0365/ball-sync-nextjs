import { NextResponse } from 'next/server';
import { SupabaseSourceLeagueRepository } from '@/src/infrastructure/repositories/supabase/SupabaseSourceLeagueRepository';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';

export async function POST(request: Request) {
  try {
    const params = await request.json();
    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseSourceLeagueRepository(supabase);
    
    const result = await repo.query(params);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error querying source leagues:", error);
    return NextResponse.json({ error: error.message || "Failed to query leagues" }, { status: 500 });
  }
}
