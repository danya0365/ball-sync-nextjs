import { NextResponse } from 'next/server';
import { MockSyncLogRepository } from '@/src/infrastructure/repositories/mock/MockSyncLogRepository';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');
    
    // In production, use SupabaseSyncLogRepository
    const repo = new MockSyncLogRepository();
    const data = await repo.getPaginated(page, perPage);
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetch logs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const repo = new MockSyncLogRepository();
    const data = await repo.create(body);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error create log:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
