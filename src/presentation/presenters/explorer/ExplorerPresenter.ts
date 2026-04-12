import { IUnifiedMatchRepository, UnifiedMatch } from "@/src/application/repositories/IUnifiedMatchRepository";
import { ISourceMatchRepository } from "@/src/application/repositories/ISourceMatchRepository";

export type ExplorerDomain = 'matches' | 'teams' | 'leagues' | 'players';
export type ExplorerTableType = 'unified' | 'source';

export class ExplorerPresenter {
  constructor(
    private readonly unifiedMatchRepo: IUnifiedMatchRepository,
    private readonly sourceMatchRepo: ISourceMatchRepository
  ) {}

  async loadUnifiedMatches(page: number, limit: number): Promise<{ data: UnifiedMatch[], total: number }> {
    const offset = (page - 1) * limit;
    const result = await this.unifiedMatchRepo.query({
      sortBy: 'match_date',
      sortOrder: 'desc',
      pagination: { limit, offset }
    });
    return { data: result.data, total: result.total || 0 };
  }

  async loadSourceMatches(page: number, limit: number): Promise<{ data: import("@/src/application/repositories/ISourceMatchRepository").SourceMatch[], total: number }> {
    const offset = (page - 1) * limit;
    const result = await this.sourceMatchRepo.query({
      sortBy: 'match_date',
      sortOrder: 'desc',
      pagination: { limit, offset }
    });
    return { data: result.data, total: result.total || 0 };
  }

  // Placeholder for future domains
  async loadTeams(tableType: ExplorerTableType, page: number, limit: number): Promise<{ data: any[], total: number }> {
    return { data: [], total: 0 };
  }
}
