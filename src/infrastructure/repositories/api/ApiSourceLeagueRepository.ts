import { ISourceLeagueRepository, SourceLeagueQuery, SourceLeagueQueryResult } from "@/src/application/repositories/ISourceLeagueRepository";
import { NormalizedLeague } from "@/src/application/services/IExternalFootballService";

/**
 * ApiSourceLeagueRepository
 * Client-side implementation for Source League Data.
 */
export class ApiSourceLeagueRepository implements ISourceLeagueRepository {
  async upsert(league: NormalizedLeague, unifiedLeagueId?: string): Promise<void> {
    const res = await fetch('/api/services/leagues/source', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ league, unifiedLeagueId })
    });
    if (!res.ok) throw new Error("Failed to upsert source league");
  }

  async getBySource(sourceName: string, externalId: string): Promise<any | null> {
    const res = await fetch(`/api/services/leagues/source?source=${sourceName}&externalId=${externalId}`);
    if (!res.ok) return null;
    return res.json();
  }

  async query(params: SourceLeagueQuery): Promise<SourceLeagueQueryResult> {
    const res = await fetch('/api/services/leagues/source/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error("Failed to query source leagues");
    return res.json();
  }
}
