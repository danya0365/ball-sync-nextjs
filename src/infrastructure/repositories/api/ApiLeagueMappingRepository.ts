import { ILeagueMappingRepository } from "@/src/application/repositories/ILeagueMappingRepository";

/**
 * ApiLeagueMappingRepository
 * Client-side implementation for League Entity Resolution.
 */
export class ApiLeagueMappingRepository implements ILeagueMappingRepository {
  private baseUrl = '/api/services/leagues/mapping';

  async findUnifiedId(sourceName: string, externalId: string): Promise<string | null> {
    const res = await fetch(`${this.baseUrl}?source=${sourceName}&externalId=${externalId}`);
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const data = await res.json();
    return data.unifiedId;
  }

  async createMapping(sourceName: string, externalId: string, unifiedLeagueId: string): Promise<void> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_name: sourceName, external_id: externalId, unified_league_id: unifiedLeagueId })
    });
    if (!res.ok) throw new Error("Failed to create league mapping");
  }
}
