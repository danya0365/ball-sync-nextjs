import { ISourcesRepository, SourcesViewModel } from "./ISourcesRepository";

export class SourcesPresenter {
  constructor(private readonly repository: ISourcesRepository) {}

  async getViewModel(): Promise<SourcesViewModel> {
    return await this.repository.getViewModelData();
  }

  async triggerManualSync(sourceName: string = 'all'): Promise<void> {
    await this.repository.triggerSync(sourceName);
  }
}
