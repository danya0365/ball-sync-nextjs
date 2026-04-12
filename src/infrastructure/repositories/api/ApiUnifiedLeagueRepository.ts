import { IUnifiedLeagueRepository, UnifiedLeague, UnifiedLeagueQuery, UnifiedLeagueQueryResult } from "@/src/application/repositories/IUnifiedLeagueRepository";

/**
 * ApiUnifiedLeagueRepository
 * Client-side implementation for Unified "Golden Record" Leagues.
 */
export class ApiUnifiedLeagueRepository implements IUnifiedLeagueRepository {
  private baseUrl = '/api/services/leagues/unified';

  async query(params: UnifiedLeagueQuery): Promise<UnifiedLeagueQueryResult> {
    const searchParams = new URLSearchParams();
    
    if (params.filters) {
      if (params.filters.country) searchParams.set('country', params.filters.country);
      if (params.filters.type) searchParams.set('type', params.filters.type);
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
    if (!res.ok) throw new Error("Failed to load unified leagues");
    return res.json();
  }

  async getById(id: string): Promise<UnifiedLeague | null> {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to load league");
    return res.json();
  }

  async approveRecord(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/approve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!res.ok) throw new Error("Failed to approve league");
    return true;
  }

  async mergeRecords(primaryId: string, duplicateId: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/merge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ primaryId, duplicateId })
    });
    if (!res.ok) throw new Error("Failed to merge leagues");
    return true;
  }

  async upsert(league: Partial<UnifiedLeague>): Promise<UnifiedLeague> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(league)
    });
    if (!res.ok) throw new Error("Failed to upsert unified league");
    return res.json();
  }
}
