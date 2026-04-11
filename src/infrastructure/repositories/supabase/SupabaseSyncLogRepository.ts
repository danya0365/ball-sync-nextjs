import { ISyncLogRepository, SyncLog, CreateSyncLogPayload, PaginatedResult, SyncLogStats } from "@/src/application/repositories/ISyncLogRepository";
import { Database } from "@/src/domain/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * SupabaseSyncLogRepository
 * Supabase implementation for SyncLog persistence
 * Following Clean Architecture - Infrastructure layer
 */
export class SupabaseSyncLogRepository implements ISyncLogRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getPaginated(page: number, perPage: number): Promise<PaginatedResult<SyncLog>> {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, error, count } = await this.supabase
      .from('sync_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);

    return {
      data: (data || []).map(this.mapToSyncLog),
      total: count || 0,
      page,
      perPage
    };
  }

  async create(data: CreateSyncLogPayload): Promise<SyncLog> {
    const { data: created, error } = await this.supabase
      .from('sync_logs')
      .insert({
        source_name: data.sourceName,
        status: data.status,
        records_processed: data.recordsProcessed,
        error_message: data.errorMessage,
        duration_ms: data.durationMs,
        triggered_by: data.triggeredBy
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToSyncLog(created);
  }

  async getStats(): Promise<SyncLogStats> {
    const { data, error } = await this.supabase
      .from('sync_logs')
      .select('status');

    if (error) throw new Error(error.message);

    const totalSyncs = data?.length || 0;
    const successSyncs = data?.filter(i => i.status === 'success').length || 0;
    const failedSyncs = totalSyncs - successSyncs;

    return {
      totalSyncs,
      successSyncs,
      failedSyncs
    };
  }

  private mapToSyncLog(row: any): SyncLog {
    return {
      id: row.id,
      sourceName: row.source_name,
      status: row.status,
      recordsProcessed: row.records_processed,
      errorMessage: row.error_message,
      durationMs: row.duration_ms,
      triggeredBy: row.triggered_by as any,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}
