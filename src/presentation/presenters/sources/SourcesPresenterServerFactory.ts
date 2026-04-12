import { SyncFootballDataUseCase } from "@/src/application/use-cases/SyncFootballDataUseCase";
import { SupabaseSyncLogRepository } from "@/src/infrastructure/repositories/supabase/SupabaseSyncLogRepository";
import { SupabaseSourceMatchRepository } from "@/src/infrastructure/repositories/supabase/SupabaseSourceMatchRepository";
import { SupabaseUnifiedMatchRepository } from "@/src/infrastructure/repositories/supabase/SupabaseUnifiedMatchRepository";
import { SupabaseMatchMappingRepository } from "@/src/infrastructure/repositories/supabase/SupabaseMatchMappingRepository";
import { SupabaseSourceTeamRepository } from "@/src/infrastructure/repositories/supabase/SupabaseSourceTeamRepository";
import { SupabaseUnifiedTeamRepository } from "@/src/infrastructure/repositories/supabase/SupabaseUnifiedTeamRepository";
import { SupabaseTeamMappingRepository } from "@/src/infrastructure/repositories/supabase/SupabaseTeamMappingRepository";
import { SupabaseSourceLeagueRepository } from "@/src/infrastructure/repositories/supabase/SupabaseSourceLeagueRepository";
import { SupabaseUnifiedLeagueRepository } from "@/src/infrastructure/repositories/supabase/SupabaseUnifiedLeagueRepository";
import { SupabaseLeagueMappingRepository } from "@/src/infrastructure/repositories/supabase/SupabaseLeagueMappingRepository";
import { SupabaseSourcePlayerRepository } from "@/src/infrastructure/repositories/supabase/SupabaseSourcePlayerRepository";
import { SupabaseUnifiedPlayerRepository } from "@/src/infrastructure/repositories/supabase/SupabaseUnifiedPlayerRepository";
import { SupabasePlayerMappingRepository } from "@/src/infrastructure/repositories/supabase/SupabasePlayerMappingRepository";
import { FootballDataOrgService } from "@/src/infrastructure/services/FootballDataOrgService";
import { TheSportsDbService } from "@/src/infrastructure/services/TheSportsDbService";
import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { SourcesPresenter } from "./SourcesPresenter";


export class SourcesPresenterServerFactory {
  static create(): SourcesPresenter {
    const sources = [
      new FootballDataOrgService(),
      new TheSportsDbService()
    ];
    
    const supabase = createAdminSupabaseClient();
    
    const logRepo = new SupabaseSyncLogRepository(supabase);
    const sourceMatchRepo = new SupabaseSourceMatchRepository(supabase);
    const unifiedMatchRepo = new SupabaseUnifiedMatchRepository(supabase);
    const matchMappingRepo = new SupabaseMatchMappingRepository(supabase);
    
    const sourceTeamRepo = new SupabaseSourceTeamRepository(supabase);
    const unifiedTeamRepo = new SupabaseUnifiedTeamRepository(supabase);
    const teamMappingRepo = new SupabaseTeamMappingRepository(supabase);
    
    const sourceLeagueRepo = new SupabaseSourceLeagueRepository(supabase);
    const unifiedLeagueRepo = new SupabaseUnifiedLeagueRepository(supabase);
    const leagueMappingRepo = new SupabaseLeagueMappingRepository(supabase);
    
    const sourcePlayerRepo = new SupabaseSourcePlayerRepository(supabase);
    const unifiedPlayerRepo = new SupabaseUnifiedPlayerRepository(supabase);
    const playerMappingRepo = new SupabasePlayerMappingRepository(supabase);
    
    const useCase = new SyncFootballDataUseCase(
      sources, 
      logRepo, 
      sourceMatchRepo, 
      unifiedMatchRepo, 
      matchMappingRepo,
      sourceTeamRepo,
      unifiedTeamRepo,
      teamMappingRepo,
      sourceLeagueRepo,
      unifiedLeagueRepo,
      leagueMappingRepo,
      sourcePlayerRepo,
      unifiedPlayerRepo,
      playerMappingRepo
    );
    
    return new SourcesPresenter(logRepo, sources, useCase);
  }
}

export function createServerSourcesPresenter(): SourcesPresenter {
  return SourcesPresenterServerFactory.create();
}
