import { SyncLog } from "@/src/application/repositories/ISyncLogRepository";

export interface SourceStatus {
  name: string;
  isOnline: boolean;
  pingMs: number;
}

export interface SourcesViewModel {
  logs: SyncLog[];
  sources: SourceStatus[];
}

export interface ISourcesRepository {
  getViewModelData(): Promise<SourcesViewModel>;
  triggerSync(sourceName: string): Promise<void>;
}
