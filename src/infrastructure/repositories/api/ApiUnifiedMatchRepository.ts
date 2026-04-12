import { IUnifiedMatchRepository, UnifiedMatch, UnifiedMatchQuery, UnifiedMatchQueryResult } from "@/src/application/repositories/IUnifiedMatchRepository";

/**
 * ApiUnifiedMatchRepository
 * Client-side implementation for Unified "Golden Record".
 */
export class ApiUnifiedMatchRepository implements IUnifiedMatchRepository {
  private baseUrl = '/api/services/matches/unified';

  async query(params: UnifiedMatchQuery): Promise<UnifiedMatchQueryResult> {
    const searchParams = new URLSearchParams();
    
    if (params.filters) {
      if (params.filters.status) {
        if (Array.isArray(params.filters.status)) {
          params.filters.status.forEach(status => searchParams.append('status', status));
        } else {
          searchParams.append('status', params.filters.status);
        }
      }
      if (params.filters.isApproved !== undefined) {
        searchParams.set('isApproved', String(params.filters.isApproved));
      }
    }

    if (params.dateRange) {
      searchParams.set('startDate', params.dateRange.startDate);
      searchParams.set('endDate', params.dateRange.endDate);
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
    if (!res.ok) throw new Error("Failed to load unified matches query");
    return res.json();
  }

  async getById(id: string): Promise<UnifiedMatch | null> {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to load match");
    return res.json();
  }

  async approveMatch(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/approve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!res.ok) throw new Error("Failed to approve match");
    return true;
  }

  async mergeMatches(primaryId: string, duplicateId: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/merge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ primaryId, duplicateId })
    });
    if (!res.ok) throw new Error("Failed to merge matches");
    return true;
  }

  async upsert(match: Partial<UnifiedMatch>): Promise<UnifiedMatch> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(match)
    });
    if (!res.ok) throw new Error("Failed to upsert unified match");
    return res.json();
  }
}
