import { ResolutionPresenter } from "./ResolutionPresenter";
import { SupabaseUnifiedMatchRepository } from "@/src/infrastructure/repositories/supabase/SupabaseUnifiedMatchRepository";
import { SupabaseUnifiedTeamRepository } from "@/src/infrastructure/repositories/supabase/SupabaseUnifiedTeamRepository";
import { SupabaseUnifiedLeagueRepository } from "@/src/infrastructure/repositories/supabase/SupabaseUnifiedLeagueRepository";
import { SupabaseUnifiedPlayerRepository } from "@/src/infrastructure/repositories/supabase/SupabaseUnifiedPlayerRepository";
import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";

export class ResolutionPresenterServerFactory {
  static create(): ResolutionPresenter {
    const supabase = createAdminSupabaseClient();
    return new ResolutionPresenter(
      new SupabaseUnifiedMatchRepository(supabase),
      new SupabaseUnifiedTeamRepository(supabase),
      new SupabaseUnifiedLeagueRepository(supabase),
      new SupabaseUnifiedPlayerRepository(supabase),
    );
  }
}

export function createServerResolutionPresenter(): ResolutionPresenter {
  return ResolutionPresenterServerFactory.create();
}
