import { IExternalFootballService, NormalizedMatch } from "@/src/application/services/IExternalFootballService";

export class TheSportsDbService implements IExternalFootballService {
  private readonly baseUrl = 'https://www.thesportsdb.com/api/v1/json/3';
  
  getSourceName(): string {
    return 'thesportsdb.com';
  }

  async fetchLiveMatches(): Promise<NormalizedMatch[]> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 600)); 
    
    return [
      {
        externalId: 'tsdb-90123',
        sourceName: this.getSourceName(),
        homeTeam: 'Real Madrid',
        awayTeam: 'FC Barcelona',
        matchDate: new Date(Date.now() - 7200000).toISOString(),
        status: 'FINISHED',
        score: {
          home: 3,
          away: 2,
        }
      }
    ];
  }

  async ping(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
  }
}
