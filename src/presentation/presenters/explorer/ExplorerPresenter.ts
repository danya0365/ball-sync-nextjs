import { IUnifiedMatchRepository, UnifiedMatch } from "@/src/application/repositories/IUnifiedMatchRepository";
import { ISourceMatchRepository, SourceMatch } from "@/src/application/repositories/ISourceMatchRepository";
import { IUnifiedTeamRepository, UnifiedTeam } from "@/src/application/repositories/IUnifiedTeamRepository";
import { ISourceTeamRepository, SourceTeam } from "@/src/application/repositories/ISourceTeamRepository";
import { IUnifiedLeagueRepository, UnifiedLeague } from "@/src/application/repositories/IUnifiedLeagueRepository";
import { ISourceLeagueRepository, SourceLeague } from "@/src/application/repositories/ISourceLeagueRepository";
import { IUnifiedPlayerRepository, UnifiedPlayer } from "@/src/application/repositories/IUnifiedPlayerRepository";
import { ISourcePlayerRepository, SourcePlayer } from "@/src/application/repositories/ISourcePlayerRepository";

export type ExplorerDomain = 'matches' | 'teams' | 'leagues' | 'players';
export type ExplorerTableType = 'unified' | 'source';

export class ExplorerPresenter {
  constructor(
    private readonly unifiedMatchRepo: IUnifiedMatchRepository,
    private readonly sourceMatchRepo: ISourceMatchRepository,
    private readonly unifiedTeamRepo?: IUnifiedTeamRepository,
    private readonly sourceTeamRepo?: ISourceTeamRepository,
    private readonly unifiedLeagueRepo?: IUnifiedLeagueRepository,
    private readonly sourceLeagueRepo?: ISourceLeagueRepository,
    private readonly unifiedPlayerRepo?: IUnifiedPlayerRepository,
    private readonly sourcePlayerRepo?: ISourcePlayerRepository,
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

  async loadSourceMatches(page: number, limit: number): Promise<{ data: SourceMatch[], total: number }> {
    const offset = (page - 1) * limit;
    const result = await this.sourceMatchRepo.query({
      sortBy: 'match_date',
      sortOrder: 'desc',
      pagination: { limit, offset }
    });
    return { data: result.data, total: result.total || 0 };
  }

  async loadUnifiedTeams(page: number, limit: number): Promise<{ data: UnifiedTeam[], total: number }> {
    if (!this.unifiedTeamRepo) return { data: [], total: 0 };
    const offset = (page - 1) * limit;
    const result = await this.unifiedTeamRepo.query({
      sortBy: 'name_en',
      sortOrder: 'asc',
      pagination: { limit, offset }
    });
    return { data: result.data, total: result.total || 0 };
  }

  async loadSourceTeams(page: number, limit: number): Promise<{ data: SourceTeam[], total: number }> {
    if (!this.sourceTeamRepo) return { data: [], total: 0 };
    const offset = (page - 1) * limit;
    const result = await this.sourceTeamRepo.query({
      sortBy: 'name',
      sortOrder: 'asc',
      pagination: { limit, offset }
    });
    return { data: result.data, total: result.total || 0 };
  }

  async loadUnifiedLeagues(page: number, limit: number): Promise<{ data: UnifiedLeague[], total: number }> {
    if (!this.unifiedLeagueRepo) return { data: [], total: 0 };
    const offset = (page - 1) * limit;
    const result = await this.unifiedLeagueRepo.query({
      sortBy: 'name_en',
      sortOrder: 'asc',
      pagination: { limit, offset }
    });
    return { data: result.data, total: result.total || 0 };
  }

  async loadSourceLeagues(page: number, limit: number): Promise<{ data: SourceLeague[], total: number }> {
    if (!this.sourceLeagueRepo) return { data: [], total: 0 };
    const offset = (page - 1) * limit;
    const result = await this.sourceLeagueRepo.query({
      sortBy: 'name',
      sortOrder: 'asc',
      pagination: { limit, offset }
    });
    return { data: result.data, total: result.total || 0 };
  }

  async loadUnifiedPlayers(page: number, limit: number): Promise<{ data: UnifiedPlayer[], total: number }> {
    if (!this.unifiedPlayerRepo) return { data: [], total: 0 };
    const offset = (page - 1) * limit;
    const result = await this.unifiedPlayerRepo.query({
      sortBy: 'name_en',
      sortOrder: 'asc',
      pagination: { limit, offset }
    });
    return { data: result.data, total: result.total || 0 };
  }

  async loadSourcePlayers(page: number, limit: number): Promise<{ data: SourcePlayer[], total: number }> {
    if (!this.sourcePlayerRepo) return { data: [], total: 0 };
    const offset = (page - 1) * limit;
    const result = await this.sourcePlayerRepo.query({
      sortBy: 'name',
      sortOrder: 'asc',
      pagination: { limit, offset }
    });
    return { data: result.data, total: result.total || 0 };
  }
}
