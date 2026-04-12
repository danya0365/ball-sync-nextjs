import { IPlayerMappingRepository } from "@/src/application/repositories/IPlayerMappingRepository";

/**
 * ApiPlayerMappingRepository
 * Client-side implementation for Player Entity Resolution.
 */
export class ApiPlayerMappingRepository implements IPlayerMappingRepository {
  private baseUrl = '/api/services/players/mapping';

  async findUnifiedId(sourceName: string, externalId: string): Promise<string | null> {
    const res = await fetch(`${this.baseUrl}?source=${sourceName}&externalId=${externalId}`);
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const data = await res.json();
    return data.unifiedId;
  }

  async createMapping(sourceName: string, externalId: string, unifiedPlayerId: string): Promise<void> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_name: sourceName, external_id: externalId, unified_player_id: unifiedPlayerId })
    });
    if (!res.ok) throw new Error("Failed to create player mapping");
  }
}
