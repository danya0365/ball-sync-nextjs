import { IUnifiedPlayerRepository, UnifiedPlayer, UnifiedPlayerQuery, UnifiedPlayerQueryResult } from "@/src/application/repositories/IUnifiedPlayerRepository";

/**
 * ApiUnifiedPlayerRepository
 * Client-side implementation for Unified "Golden Record" Players.
 */
export class ApiUnifiedPlayerRepository implements IUnifiedPlayerRepository {
  private baseUrl = '/api/services/players/unified';

  async query(params: UnifiedPlayerQuery): Promise<UnifiedPlayerQueryResult> {
    const searchParams = new URLSearchParams();
    
    if (params.filters) {
      if (params.filters.teamId) searchParams.set('teamId', params.filters.teamId);
      if (params.filters.nationality) searchParams.set('nationality', params.filters.nationality);
      if (params.filters.position) searchParams.set('position', params.filters.position);
      if (params.filters.isApproved !== undefined) searchParams.set('isApproved', String(params.filters.isApproved));
    }
    if (params.search) searchParams.set('search', params.search);
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    if (params.pagination) {
      searchParams.set('limit', String(params.pagination.limit));
      if (params.pagination.offset) searchParams.set('offset', String(params.pagination.offset));
    }

    const query = searchParams.toString();
    const res = await fetch(`${this.baseUrl}${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error("Failed to load unified players");
    return res.json();
  }

  async getById(id: string): Promise<UnifiedPlayer | null> {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to load player");
    return res.json();
  }

  async approveRecord(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/approve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!res.ok) throw new Error("Failed to approve player");
    return true;
  }

  async mergeRecords(primaryId: string, duplicateId: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/merge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ primaryId, duplicateId })
    });
    if (!res.ok) throw new Error("Failed to merge players");
    return true;
  }

  async upsert(player: Partial<UnifiedPlayer>): Promise<UnifiedPlayer> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(player)
    });
    if (!res.ok) throw new Error("Failed to upsert unified player");
    return res.json();
  }
}
