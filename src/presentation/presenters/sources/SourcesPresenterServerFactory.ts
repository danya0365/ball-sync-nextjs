import { SyncFootballDataUseCase } from "@/src/application/use-cases/SyncFootballDataUseCase";
import { SupabaseSyncLogRepository } from "@/src/infrastructure/repositories/supabase/SupabaseSyncLogRepository";
import { SupabaseSourceMatchRepository } from "@/src/infrastructure/repositories/supabase/SupabaseSourceMatchRepository";
import { SupabaseUnifiedMatchRepository } from "@/src/infrastructure/repositories/supabase/SupabaseUnifiedMatchRepository";
import { SupabaseMatchMappingRepository } from "@/src/infrastructure/repositories/supabase/SupabaseMatchMappingRepository";
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
    
    const useCase = new SyncFootballDataUseCase(
      sources, 
      logRepo, 
      sourceMatchRepo, 
      unifiedMatchRepo, 
      matchMappingRepo
    );
    
    return new SourcesPresenter(logRepo, sources, useCase);
  }
}

export function createServerSourcesPresenter(): SourcesPresenter {
  return SourcesPresenterServerFactory.create();
}
