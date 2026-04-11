/**
 * MockSyncLogRepository
 * Mock implementation for development and testing
 * Following Clean Architecture - Infrastructure layer
 */

import { ISyncLogRepository, SyncLog, CreateSyncLogPayload, PaginatedResult, SyncLogStats } from "@/src/application/repositories/ISyncLogRepository";
import dayjs from "dayjs";

export class MockSyncLogRepository implements ISyncLogRepository {
  private items: SyncLog[] = [
    {
      id: `log-1`,
      sourceName: 'football-data.org',
      status: 'success',
      recordsProcessed: 42,
      durationMs: 850,
      triggeredBy: 'cron',
      createdAt: dayjs().subtract(1, 'hour').toISOString(),
      updatedAt: dayjs().subtract(1, 'hour').toISOString()
    },
    {
      id: `log-2`,
      sourceName: 'thesportsdb.com',
      status: 'success',
      recordsProcessed: 15,
      durationMs: 620,
      triggeredBy: 'manual',
      createdAt: dayjs().subtract(30, 'minute').toISOString(),
      updatedAt: dayjs().subtract(30, 'minute').toISOString()
    }
  ];

  async getPaginated(page: number, perPage: number): Promise<PaginatedResult<SyncLog>> {
    await this.delay(100);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    
    // Sort logic (newest first)
    const sortedItems = [...this.items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const paginatedItems = sortedItems.slice(start, end);

    return {
      data: paginatedItems,
      total: this.items.length,
      page,
      perPage,
    };
  }

  async create(data: CreateSyncLogPayload): Promise<SyncLog> {
    await this.delay(100);
    const newItem: SyncLog = {
      id: `log-${Date.now()}`,
      ...data,
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString()
    };
    this.items.unshift(newItem); // put at start
    return newItem;
  }

  async getStats(): Promise<SyncLogStats> {
    await this.delay(50);
    const success = this.items.filter(i => i.status === 'success').length;
    return {
      totalSyncs: this.items.length,
      successSyncs: success,
      failedSyncs: this.items.length - success
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockSyncLogRepository = new MockSyncLogRepository();
