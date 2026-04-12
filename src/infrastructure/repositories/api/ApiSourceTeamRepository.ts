import { ISourceTeamRepository, SourceTeamQuery, SourceTeamQueryResult } from "@/src/application/repositories/ISourceTeamRepository";
import { NormalizedTeam } from "@/src/application/services/IExternalFootballService";

/**
 * ApiSourceTeamRepository
 * Client-side implementation for Source Team Data.
 */
export class ApiSourceTeamRepository implements ISourceTeamRepository {
  async upsert(team: NormalizedTeam, unifiedTeamId?: string): Promise<void> {
    const res = await fetch('/api/services/teams/source', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team, unifiedTeamId })
    });
    if (!res.ok) throw new Error("Failed to upsert source team");
  }

  async getBySource(sourceName: string, externalId: string): Promise<any | null> {
    const res = await fetch(`/api/services/teams/source?source=${sourceName}&externalId=${externalId}`);
    if (!res.ok) return null;
    return res.json();
  }

  async query(params: SourceTeamQuery): Promise<SourceTeamQueryResult> {
    const res = await fetch('/api/services/teams/source/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error("Failed to query source teams");
    return res.json();
  }
}
