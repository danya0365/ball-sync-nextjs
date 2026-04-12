import { NextResponse } from 'next/server';
import { SupabaseSourceTeamRepository } from '@/src/infrastructure/repositories/supabase/SupabaseSourceTeamRepository';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';

export async function POST(request: Request) {
  try {
    const params = await request.json();
    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseSourceTeamRepository(supabase);
    
    const result = await repo.query(params);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error querying source teams:", error);
    return NextResponse.json({ error: error.message || "Failed to query teams" }, { status: 500 });
  }
}
