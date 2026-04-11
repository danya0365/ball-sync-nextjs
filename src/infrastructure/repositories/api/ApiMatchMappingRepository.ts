import { IMatchMappingRepository } from "@/src/application/repositories/IMatchMappingRepository";

/**
 * ApiMatchMappingRepository
 * Client-side implementation for Entity Resolution.
 */
export class ApiMatchMappingRepository implements IMatchMappingRepository {
  private baseUrl = '/api/services/matches/mapping';

  async findUnifiedId(sourceName: string, externalId: string): Promise<string | null> {
    const res = await fetch(`${this.baseUrl}?source=${sourceName}&externalId=${externalId}`);
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const data = await res.json();
    return data.unifiedId;
  }

  async createMapping(sourceName: string, externalId: string, unifiedId: string): Promise<void> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        source_name: sourceName, 
        external_id: externalId, 
        unified_match_id: unifiedId 
      })
    });
    if (!res.ok) throw new Error("Failed to create mapping");
  }
}
