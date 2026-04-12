import { NextResponse } from 'next/server';
import { SupabaseUnifiedMatchRepository } from '@/src/infrastructure/repositories/supabase/SupabaseUnifiedMatchRepository';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';

export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Match ID is required" }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseUnifiedMatchRepository(supabase);
    
    await repo.approveMatch(id);
    
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("Error approving match:", error);
    return NextResponse.json({ error: error.message || "Failed to approve match" }, { status: 500 });
  }
}
