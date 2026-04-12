import { ResolutionPresenter } from "./ResolutionPresenter";
import { SupabaseUnifiedMatchRepository } from "@/src/infrastructure/repositories/supabase/SupabaseUnifiedMatchRepository";
import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";

export class ResolutionPresenterServerFactory {
  static create(): ResolutionPresenter {
    const supabase = createAdminSupabaseClient();
    const repository = new SupabaseUnifiedMatchRepository(supabase);
    return new ResolutionPresenter(repository);
  }
}

export function createServerResolutionPresenter(): ResolutionPresenter {
  return ResolutionPresenterServerFactory.create();
}
