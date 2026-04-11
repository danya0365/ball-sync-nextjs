import { IUnifiedMatchRepository, UnifiedMatch } from "@/src/application/repositories/IUnifiedMatchRepository";

/**
 * ApiUnifiedMatchRepository
 * Client-side implementation for Unified "Golden Record".
 */
export class ApiUnifiedMatchRepository implements IUnifiedMatchRepository {
  private baseUrl = '/api/services/matches/unified';

  async getAll(): Promise<UnifiedMatch[]> {
    const res = await fetch(this.baseUrl);
    if (!res.ok) throw new Error("Failed to load unified matches");
    return res.json();
  }

  async getById(id: string): Promise<UnifiedMatch | null> {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to load match");
    return res.json();
  }

  async upsert(match: Partial<UnifiedMatch>): Promise<UnifiedMatch> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(match)
    });
    if (!res.ok) throw new Error("Failed to upsert unified match");
    return res.json();
  }
}
