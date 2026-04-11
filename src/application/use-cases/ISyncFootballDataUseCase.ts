export interface ISyncFootballDataUseCase {
  execute(sourceName?: string, triggeredBy?: 'cron' | 'manual'): Promise<any>;
}
