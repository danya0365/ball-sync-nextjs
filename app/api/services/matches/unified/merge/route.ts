import { NextResponse } from 'next/server';
import { SupabaseUnifiedMatchRepository } from '@/src/infrastructure/repositories/supabase/SupabaseUnifiedMatchRepository';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';

export async function POST(request: Request) {
  try {
    const { primaryId, duplicateId } = await request.json();
    if (!primaryId || !duplicateId) {
      return NextResponse.json({ error: "primaryId and duplicateId are required" }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseUnifiedMatchRepository(supabase);
    
    await repo.mergeMatches(primaryId, duplicateId);
    
    return NextResponse.json({ success: true, primaryId, duplicateId });
  } catch (error: any) {
    console.error("Error merging matches:", error);
    return NextResponse.json({ error: error.message || "Failed to merge matches" }, { status: 500 });
  }
}
