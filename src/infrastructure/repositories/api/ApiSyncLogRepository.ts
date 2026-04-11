"use client";

import { ISyncLogRepository, SyncLog, CreateSyncLogPayload, PaginatedResult, SyncLogStats } from "@/src/application/repositories/ISyncLogRepository";

export class ApiSyncLogRepository implements ISyncLogRepository {
  private baseUrl = '/api/sync-logs';

  async getPaginated(page: number, perPage: number): Promise<PaginatedResult<SyncLog>> {
    const res = await fetch(`${this.baseUrl}?page=${page}&perPage=${perPage}`);
    if (!res.ok) throw new Error("Failed to load sync logs");
    return res.json();
  }

  async create(data: CreateSyncLogPayload): Promise<SyncLog> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create log");
    return res.json();
  }

  async getStats(): Promise<SyncLogStats> {
    const res = await fetch(`${this.baseUrl}/stats`);
    if (!res.ok) throw new Error("Failed to load stats");
    return res.json();
  }
}
