"use client";

import { IExternalFootballService, NormalizedMatch } from "@/src/application/services/IExternalFootballService";

export class ApiExternalFootballService implements IExternalFootballService {
  constructor(private readonly sourceName: string) {}

  getSourceName(): string {
    return this.sourceName;
  }

  async fetchLiveMatches(): Promise<NormalizedMatch[]> {
    const res = await fetch(`/api/services/matches?source=${encodeURIComponent(this.sourceName)}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch matches for ${this.sourceName}`);
    }
    return res.json();
  }

  async ping(): Promise<boolean> {
    const res = await fetch(`/api/services/ping?source=${encodeURIComponent(this.sourceName)}`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.isOnline;
  }
}
