import { IUnifiedMatchRepository, UnifiedMatch } from "@/src/application/repositories/IUnifiedMatchRepository";
import { IUnifiedTeamRepository, UnifiedTeam } from "@/src/application/repositories/IUnifiedTeamRepository";
import { IUnifiedLeagueRepository, UnifiedLeague } from "@/src/application/repositories/IUnifiedLeagueRepository";
import { IUnifiedPlayerRepository, UnifiedPlayer } from "@/src/application/repositories/IUnifiedPlayerRepository";

export type ResolutionDomain = 'matches' | 'teams' | 'leagues' | 'players';

export interface ResolutionViewModel {
  pendingMatches: UnifiedMatch[];
  pendingTeams: UnifiedTeam[];
  pendingLeagues: UnifiedLeague[];
  pendingPlayers: UnifiedPlayer[];
  isApproving: boolean;
}

export class ResolutionPresenter {
  constructor(
    private readonly matchRepository: IUnifiedMatchRepository,
    private readonly teamRepository?: IUnifiedTeamRepository,
    private readonly leagueRepository?: IUnifiedLeagueRepository,
    private readonly playerRepository?: IUnifiedPlayerRepository,
  ) {}

  async getViewModel(): Promise<ResolutionViewModel> {
    const [matchResult, teamResult, leagueResult, playerResult] = await Promise.all([
      this.matchRepository.query({
        filters: { isApproved: false },
        sortBy: 'match_date',
        sortOrder: 'desc',
        pagination: { limit: 50 },
      }),
      this.teamRepository?.query({
        filters: { isApproved: false },
        sortBy: 'name_en',
        sortOrder: 'asc',
        pagination: { limit: 50 },
      }).catch(() => ({ data: [], total: 0 })) ?? Promise.resolve({ data: [], total: 0 }),
      this.leagueRepository?.query({
        filters: { isApproved: false },
        sortBy: 'name_en',
        sortOrder: 'asc',
        pagination: { limit: 50 },
      }).catch(() => ({ data: [], total: 0 })) ?? Promise.resolve({ data: [], total: 0 }),
      this.playerRepository?.query({
        filters: { isApproved: false },
        sortBy: 'name_en',
        sortOrder: 'asc',
        pagination: { limit: 50 },
      }).catch(() => ({ data: [], total: 0 })) ?? Promise.resolve({ data: [], total: 0 }),
    ]);

    return {
      pendingMatches: matchResult.data,
      pendingTeams: teamResult.data as UnifiedTeam[],
      pendingLeagues: leagueResult.data as UnifiedLeague[],
      pendingPlayers: playerResult.data as UnifiedPlayer[],
      isApproving: false
    };
  }

  // Matches
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

  // Teams
  async approveTeam(id: string): Promise<void> {
    if (!this.teamRepository) throw new Error("Team repository not available");
    await this.teamRepository.approveRecord(id);
  }

  async mergeTeams(primaryId: string, duplicateId: string): Promise<void> {
    if (!this.teamRepository) throw new Error("Team repository not available");
    await this.teamRepository.mergeRecords(primaryId, duplicateId);
  }

  // Leagues
  async approveLeague(id: string): Promise<void> {
    if (!this.leagueRepository) throw new Error("League repository not available");
    await this.leagueRepository.approveRecord(id);
  }

  async mergeLeagues(primaryId: string, duplicateId: string): Promise<void> {
    if (!this.leagueRepository) throw new Error("League repository not available");
    await this.leagueRepository.mergeRecords(primaryId, duplicateId);
  }

  // Players
  async approvePlayer(id: string): Promise<void> {
    if (!this.playerRepository) throw new Error("Player repository not available");
    await this.playerRepository.approveRecord(id);
  }

  async mergePlayers(primaryId: string, duplicateId: string): Promise<void> {
    if (!this.playerRepository) throw new Error("Player repository not available");
    await this.playerRepository.mergeRecords(primaryId, duplicateId);
  }
}
