import { NextResponse } from 'next/server';
import { SyncFootballDataUseCase } from '@/src/application/use-cases/SyncFootballDataUseCase';
import { FootballDataOrgRepository } from '@/src/infrastructure/repositories/api/FootballDataOrgRepository';
import { TheSportsDbRepository } from '@/src/infrastructure/repositories/api/TheSportsDbRepository';
import { MockSyncLogRepository } from '@/src/infrastructure/repositories/mock/MockSyncLogRepository';

// TODO: Use environment variable in production
const CRON_SECRET = process.env.CRON_SECRET || 'dev-cron-secret';

// Factory specifically for the Server API Route
function createUseCase() {
  const sources = [
    new FootballDataOrgRepository(),
    new TheSportsDbRepository()
  ];
  // In production, instantiate SupabaseSyncLogRepository instead
  const syncLogRepo = new MockSyncLogRepository(); 
  return new SyncFootballDataUseCase(sources, syncLogRepo);
}

export async function GET(request: Request) {
  // Security Verification
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${CRON_SECRET}` && process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Find target source from search params (optional)
  const { searchParams } = new URL(request.url);
  const sourceName = searchParams.get('source') || 'all';

  try {
    const useCase = createUseCase();
    const results = await useCase.execute(sourceName, 'cron');

    return NextResponse.json({
      success: true,
      message: 'Synchronization completed',
      results
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
