import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';
import { SupabaseUnifiedPlayerRepository } from '@/src/infrastructure/repositories/supabase/SupabaseUnifiedPlayerRepository';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceName = searchParams.get('source');
    
    if (!sourceName) {
      const supabase = createAdminSupabaseClient();
      const repo = new SupabaseUnifiedPlayerRepository(supabase);
      const result = await repo.query({ pagination: { limit: 100 } });
      return NextResponse.json(result.data);
    }

    // Player fetch from external sources returns empty on free tier
    return NextResponse.json([]);
  } catch (error: any) {
    console.error("Error fetching players:", error);
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
