import { IUnifiedMatchRepository, UnifiedMatch } from "@/src/application/repositories/IUnifiedMatchRepository";

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
}
