import { ITeamMappingRepository } from "@/src/application/repositories/ITeamMappingRepository";

/**
 * ApiTeamMappingRepository
 * Client-side implementation for Team Entity Resolution.
 */
export class ApiTeamMappingRepository implements ITeamMappingRepository {
  private baseUrl = '/api/services/teams/mapping';

  async findUnifiedId(sourceName: string, externalId: string): Promise<string | null> {
    const res = await fetch(`${this.baseUrl}?source=${sourceName}&externalId=${externalId}`);
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const data = await res.json();
    return data.unifiedId;
  }

  async createMapping(sourceName: string, externalId: string, unifiedTeamId: string): Promise<void> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_name: sourceName, external_id: externalId, unified_team_id: unifiedTeamId })
    });
    if (!res.ok) throw new Error("Failed to create team mapping");
  }
}
