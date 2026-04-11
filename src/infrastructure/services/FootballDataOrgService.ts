import { IExternalFootballService, NormalizedMatch } from "@/src/application/services/IExternalFootballService";

export class FootballDataOrgService implements IExternalFootballService {
  private readonly baseUrl = 'https://api.football-data.org/v4';
  
  constructor(private apiKey: string = 'demo-key') {}

  getSourceName(): string {
    return 'football-data.org';
  }

  async fetchLiveMatches(): Promise<NormalizedMatch[]> {
    // In a real application, we would use fetch with headers: { 'X-Auth-Token': this.apiKey }
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency
    
    return [
      {
        externalId: 'fd-45123',
        sourceName: this.getSourceName(),
        homeTeam: 'Arsenal FC',
        awayTeam: 'Manchester United FC',
        matchDate: new Date().toISOString(),
        status: 'IN_PLAY',
        score: {
          home: 2,
          away: 1,
          halfTimeHome: 1,
          halfTimeAway: 0
        }
      },
      {
        externalId: 'fd-45124',
        sourceName: this.getSourceName(),
        homeTeam: 'Liverpool FC',
        awayTeam: 'Chelsea FC',
        matchDate: new Date(Date.now() + 3600000).toISOString(),
        status: 'SCHEDULED',
        score: {
          home: null,
          away: null
        }
      }
    ];
  }

  async ping(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true; // Simulate successful connection
  }
}
