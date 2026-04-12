import { NextResponse } from 'next/server';
import { SupabaseSourcePlayerRepository } from '@/src/infrastructure/repositories/supabase/SupabaseSourcePlayerRepository';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';

export async function POST(request: Request) {
  try {
    const params = await request.json();
    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseSourcePlayerRepository(supabase);
    
    const result = await repo.query(params);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error querying source players:", error);
    return NextResponse.json({ error: error.message || "Failed to query players" }, { status: 500 });
  }
}
