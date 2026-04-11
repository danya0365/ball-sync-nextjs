import { ISourceMatchRepository } from "@/src/application/repositories/ISourceMatchRepository";
import { NormalizedMatch } from "@/src/application/services/IExternalFootballService";

/**
 * ApiSourceMatchRepository
 * Client-side implementation for Source Data.
 */
export class ApiSourceMatchRepository implements ISourceMatchRepository {
  async upsert(match: NormalizedMatch, unifiedMatchId?: string): Promise<void> {
    const res = await fetch('/api/services/matches/source', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ match, unifiedMatchId })
    });
    if (!res.ok) throw new Error("Failed to upsert source match");
  }

  async getBySource(sourceName: string, externalId: string): Promise<any | null> {
    const res = await fetch(`/api/services/matches/source?source=${sourceName}&externalId=${externalId}`);
    if (!res.ok) return null;
    return res.json();
  }
}
