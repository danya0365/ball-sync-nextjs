/**
 * ISyncLogRepository
 * Repository interface for SyncLog data access
 * Following Clean Architecture - Application layer
 */

export type SyncLogStatus = 'success' | 'failed' | 'partial';

export interface SyncLog {
  id: string;
  sourceName: string;
  status: SyncLogStatus;
  recordsProcessed: number;
  errorMessage?: string;
  durationMs: number;
  triggeredBy: 'cron' | 'manual';
  createdAt: string;
  updatedAt: string;
}

export interface SyncLogStats {
  totalSyncs: number;
  successSyncs: number;
  failedSyncs: number;
}

export interface CreateSyncLogPayload {
  sourceName: string;
  status: SyncLogStatus;
  recordsProcessed: number;
  errorMessage?: string;
  durationMs: number;
  triggeredBy: 'cron' | 'manual';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

export interface ISyncLogRepository {
  getPaginated(page: number, perPage: number): Promise<PaginatedResult<SyncLog>>;
  create(data: CreateSyncLogPayload): Promise<SyncLog>;
  getStats(): Promise<SyncLogStats>;
}
