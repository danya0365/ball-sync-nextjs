import { NextResponse } from 'next/server';
import { SupabaseUnifiedMatchRepository } from '@/src/infrastructure/repositories/supabase/SupabaseUnifiedMatchRepository';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';
import { UnifiedMatchQuery } from '@/src/application/repositories/IUnifiedMatchRepository';

/**
 * API Route for Unified Match (Golden Record)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const queryParams: UnifiedMatchQuery = {
      filters: {},
      pagination: { limit: 100 } // Default limit
    };

    // Filters
    const statuses = searchParams.getAll('status');
    if (statuses.length > 0) queryParams.filters!.status = statuses;
    
    const isApproved = searchParams.get('isApproved');
    if (isApproved !== null) queryParams.filters!.isApproved = isApproved === 'true';

    // Date Range
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    if (startDate && endDate) {
      queryParams.dateRange = { startDate, endDate };
    }

    // Search and Sort
    const search = searchParams.get('search');
    if (search) queryParams.search = search;
    
    const sortBy = searchParams.get('sortBy');
    if (sortBy) queryParams.sortBy = sortBy;
    
    const sortOrder = searchParams.get('sortOrder');
    if (sortOrder === 'asc' || sortOrder === 'desc') queryParams.sortOrder = sortOrder;

    // Pagination
    const limit = searchParams.get('limit');
    if (limit) queryParams.pagination!.limit = parseInt(limit, 10);
    
    const offset = searchParams.get('offset');
    if (offset) queryParams.pagination!.offset = parseInt(offset, 10);

    const supabase = createAdminSupabaseClient();
    const repo = new SupabaseUnifiedMatchRepository(supabase);
    
    const data = await repo.query(queryParams);
    return NextResponse.json(data);
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
