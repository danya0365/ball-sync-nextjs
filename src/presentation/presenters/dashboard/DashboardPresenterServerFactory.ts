import { DashboardPresenter } from "./DashboardPresenter";
import { MockDashboardRepository } from "@/src/infrastructure/repositories/mock/MockDashboardRepository";
import { SupabaseUnifiedMatchRepository } from "@/src/infrastructure/repositories/supabase/SupabaseUnifiedMatchRepository";
import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";

export class DashboardPresenterServerFactory {
  static create(): DashboardPresenter {
    const repository = new MockDashboardRepository();
    const supabaseClient = createAdminSupabaseClient();
    const matchRepository = new SupabaseUnifiedMatchRepository(supabaseClient);
    return new DashboardPresenter(repository, matchRepository);
  }
}

export function createServerDashboardPresenter(): DashboardPresenter {
  return DashboardPresenterServerFactory.create();
}
