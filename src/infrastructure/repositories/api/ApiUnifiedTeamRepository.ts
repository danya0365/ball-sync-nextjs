import { IUnifiedTeamRepository, UnifiedTeam, UnifiedTeamQuery, UnifiedTeamQueryResult } from "@/src/application/repositories/IUnifiedTeamRepository";

/**
 * ApiUnifiedTeamRepository
 * Client-side implementation for Unified "Golden Record" Teams.
 */
export class ApiUnifiedTeamRepository implements IUnifiedTeamRepository {
  private baseUrl = '/api/services/teams/unified';

  async query(params: UnifiedTeamQuery): Promise<UnifiedTeamQueryResult> {
    const searchParams = new URLSearchParams();
    
    if (params.filters) {
      if (params.filters.country) searchParams.set('country', params.filters.country);
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
    if (!res.ok) throw new Error("Failed to load unified teams");
    return res.json();
  }

  async getById(id: string): Promise<UnifiedTeam | null> {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to load team");
    return res.json();
  }

  async approveRecord(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/approve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!res.ok) throw new Error("Failed to approve team");
    return true;
  }

  async mergeRecords(primaryId: string, duplicateId: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/merge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ primaryId, duplicateId })
    });
    if (!res.ok) throw new Error("Failed to merge teams");
    return true;
  }

  async upsert(team: Partial<UnifiedTeam>): Promise<UnifiedTeam> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(team)
    });
    if (!res.ok) throw new Error("Failed to upsert unified team");
    return res.json();
  }
}
