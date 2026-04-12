import { SyncDomain } from "./SyncFootballDataUseCase";

export interface ISyncFootballDataUseCase {
  execute(sourceName?: string, triggeredBy?: 'cron' | 'manual', domain?: SyncDomain): Promise<any>;
}
