import { IMatchRepository } from "@/src/application/repositories/IMatchRepository";
import { NormalizedMatch } from "@/src/application/services/IExternalFootballService";

/**
 * MockMatchRepository
 * Mock implementation for development and testing
 * Following Clean Architecture - Infrastructure layer
 */
export class MockMatchRepository implements IMatchRepository {
  private items: NormalizedMatch[] = [];

  async getMatches(status?: string): Promise<NormalizedMatch[]> {
    await this.delay(100);
    if (!status) return this.items;
    return this.items.filter(item => item.status === status);
  }

  async upsertMany(matches: NormalizedMatch[]): Promise<void> {
    await this.delay(200);
    matches.forEach(match => {
      const index = this.items.findIndex(i => i.externalId === match.externalId);
      if (index >= 0) {
        this.items[index] = { ...this.items[index], ...match };
      } else {
        this.items.push(match);
      }
    });
  }

  async getByExternalId(externalId: string): Promise<NormalizedMatch | null> {
    await this.delay(50);
    return this.items.find(i => i.externalId === externalId) || null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockMatchRepository = new MockMatchRepository();
