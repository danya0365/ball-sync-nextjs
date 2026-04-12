import { ISourcePlayerRepository, SourcePlayerQuery, SourcePlayerQueryResult } from "@/src/application/repositories/ISourcePlayerRepository";
import { NormalizedPlayer } from "@/src/application/services/IExternalFootballService";

/**
 * ApiSourcePlayerRepository
 * Client-side implementation for Source Player Data.
 */
export class ApiSourcePlayerRepository implements ISourcePlayerRepository {
  async upsert(player: NormalizedPlayer, unifiedPlayerId?: string): Promise<void> {
    const res = await fetch('/api/services/players/source', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player, unifiedPlayerId })
    });
    if (!res.ok) throw new Error("Failed to upsert source player");
  }

  async getBySource(sourceName: string, externalId: string): Promise<any | null> {
    const res = await fetch(`/api/services/players/source?source=${sourceName}&externalId=${externalId}`);
    if (!res.ok) return null;
    return res.json();
  }

  async query(params: SourcePlayerQuery): Promise<SourcePlayerQueryResult> {
    const res = await fetch('/api/services/players/source/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error("Failed to query source players");
    return res.json();
  }
}
