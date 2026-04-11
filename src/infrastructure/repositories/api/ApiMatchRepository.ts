import { IMatchRepository } from "@/src/application/repositories/IMatchRepository";
import { NormalizedMatch } from "@/src/application/services/IExternalFootballService";

/**
 * ApiMatchRepository
 * API implementation for Match data access (Client-side)
 * Following Clean Architecture - Infrastructure layer
 */
export class ApiMatchRepository implements IMatchRepository {
  private baseUrl = '/api/services/matches';

  async getMatches(status?: string): Promise<NormalizedMatch[]> {
    const url = status ? `${this.baseUrl}?status=${status}` : this.baseUrl;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load matches");
    return res.json();
  }

  async upsertMany(matches: NormalizedMatch[]): Promise<void> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matches })
    });
    if (!res.ok) throw new Error("Failed to upsert matches");
  }

  async getByExternalId(externalId: string): Promise<NormalizedMatch | null> {
    const res = await fetch(`${this.baseUrl}/${externalId}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to load match");
    return res.json();
  }
}
