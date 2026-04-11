"use client";

import { ISourcesRepository, SourcesViewModel } from "@/src/presentation/presenters/sources/ISourcesRepository";

export class ApiSourcesRepository implements ISourcesRepository {
  private baseUrl = '/api/sources';

  async getViewModelData(): Promise<SourcesViewModel> {
    const res = await fetch(this.baseUrl);
    if (!res.ok) throw new Error("Failed to load sources data");
    return res.json();
  }

  async triggerSync(sourceName: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceName })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to trigger sync");
    }
  }
}
