import { IUnifiedMatchRepository, UnifiedMatch } from "@/src/application/repositories/IUnifiedMatchRepository";

export type ResolutionDomain = 'matches' | 'teams' | 'leagues' | 'players';

export interface ResolutionViewModel {
  pendingMatches: UnifiedMatch[];
  isApproving: boolean;
}

export class ResolutionPresenter {
  constructor(private readonly matchRepository: IUnifiedMatchRepository) {}

  async getViewModel(): Promise<ResolutionViewModel> {
    const result = await this.matchRepository.query({
      filters: { isApproved: false },
      sortBy: 'match_date',
      sortOrder: 'desc',
      pagination: { limit: 50 },
    });

    return {
      pendingMatches: result.data,
      isApproving: false
    };
  }

  async approveMatch(id: string): Promise<void> {
    await this.matchRepository.approveMatch(id);
  }

  async getApprovedMatches(dateRange?: { startDate: string, endDate: string }): Promise<UnifiedMatch[]> {
    const result = await this.matchRepository.query({
      filters: { isApproved: true },
      dateRange,
      sortBy: 'match_date',
      sortOrder: 'desc',
      pagination: { limit: 100 }
    });
    return result.data;
  }

  async mergeMatches(primaryId: string, duplicateId: string): Promise<void> {
    await this.matchRepository.mergeMatches(primaryId, duplicateId);
  }
}
