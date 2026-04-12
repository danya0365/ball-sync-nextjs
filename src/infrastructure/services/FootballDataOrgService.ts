import { IExternalFootballService, NormalizedMatch, NormalizedTeam, NormalizedLeague, NormalizedPlayer } from "@/src/application/services/IExternalFootballService";

export interface FootballDataMatch {
  id: number;
  utcDate: string;
  status: 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED' | 'EXTRA_TIME' | 'PENALTY_SHOOTOUT' | 'FINISHED' | 'SUSPENDED' | 'POSTPONED' | 'CANCELLED' | 'AWARDED';
  homeTeam?: { name: string };
  awayTeam?: { name: string };
  competition?: { id: number; name: string };
  score?: {
    fullTime?: { home: number | null, away: number | null };
    halfTime?: { home: number | null, away: number | null };
  };
}

export interface FootballDataResponse {
  matches?: FootballDataMatch[];
}

interface FootballDataCompetition {
  id: number;
  name: string;
  code: string;
  area?: { name: string };
  emblem?: string;
  type?: string;
  currentSeason?: { startDate: string; endDate: string };
}

interface FootballDataTeam {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
  crest?: string;
  area?: { name: string };
  founded?: number;
  venue?: string;
  website?: string;
}

export class FootballDataOrgService implements IExternalFootballService {
  private readonly baseUrl = process.env.FOOTBALL_DATA_BASE_URL || 'https://api.football-data.org/v4';
  private readonly apiKey = process.env.FOOTBALL_DATA_API_KEY || '';
  
  private requestCount: number = 0;
  private lastRequestTime: number = Date.now();

  getSourceName(): string {
    return 'football-data.org';
  }

  /**
   * Check rate limit (10 requests per minute for free tier)
   */
  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const timeDiff = now - this.lastRequestTime;

    // Reset counter every minute
    if (timeDiff > 60000) {
      this.requestCount = 0;
      this.lastRequestTime = now;
    }

    // Wait if rate limit exceeded
    if (this.requestCount >= 10) {
      const waitTime = 60000 - timeDiff;
      console.warn(`[${this.getSourceName()}] Rate limit reached. Waiting ${waitTime}ms...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      this.requestCount = 0;
      this.lastRequestTime = Date.now();
    }

    this.requestCount++;
  }

  private async fetchApi<T>(endpoint: string): Promise<T> {
    await this.checkRateLimit();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'X-Auth-Token': this.apiKey,
        'Content-Type': 'application/json'
      },
      // Optional: Add Next.js caching behaviour if needed. Currently passing to dynamic fetches.
      cache: 'no-store'
    });

    if (!response.ok) {
      const message = await response.text();
      switch (response.status) {
        case 400: throw new Error(`Bad Request: ${message}`);
        case 403: throw new Error("Forbidden: Invalid API key or plan limits");
        case 404: throw new Error(`Not Found: ${message}`);
        case 429: throw new Error("Too Many Requests: Rate limit exceeded");
        default: throw new Error(`API Error (${response.status}): ${message}`);
      }
    }

    return response.json();
  }

  async fetchLiveMatches(): Promise<NormalizedMatch[]> {
    try {
      // Fetch today's matches (or IN_PLAY directly if the API supports it without premium filters)
      const data = await this.fetchApi<FootballDataResponse>('/matches');
      const matches = data.matches || [];

      return matches.map((m: FootballDataMatch) => ({
        externalId: m.id.toString(),
        sourceName: this.getSourceName(),
        homeTeam: m.homeTeam?.name || 'Unknown',
        awayTeam: m.awayTeam?.name || 'Unknown',
        leagueName: m.competition?.name,
        leagueExternalId: m.competition?.id?.toString(),
        matchDate: m.utcDate,
        status: m.status,
        score: {
          home: m.score?.fullTime?.home ?? null,
          away: m.score?.fullTime?.away ?? null,
          halfTimeHome: m.score?.halfTime?.home ?? null,
          halfTimeAway: m.score?.halfTime?.away ?? null
        }
      }));
    } catch (error: any) {
      console.error(`[${this.getSourceName()}] fetchLiveMatches error:`, error);
      throw error;
    }
  }

  async fetchLeagues(): Promise<NormalizedLeague[]> {
    try {
      const data = await this.fetchApi<{ competitions: FootballDataCompetition[] }>('/competitions');
      const competitions = data.competitions || [];

      return competitions.map((c) => {
        const season = c.currentSeason
          ? `${c.currentSeason.startDate?.slice(0, 4)}-${c.currentSeason.endDate?.slice(0, 4)}`
          : undefined;

        return {
          externalId: c.id.toString(),
          sourceName: this.getSourceName(),
          name: c.name,
          code: c.code,
          country: c.area?.name,
          emblemUrl: c.emblem,
          type: this.mapCompetitionType(c.type),
          currentSeason: season
        };
      });
    } catch (error: any) {
      console.error(`[${this.getSourceName()}] fetchLeagues error:`, error);
      throw error;
    }
  }

  async fetchTeams(): Promise<NormalizedTeam[]> {
    try {
      // Step 1: Get all accessible competitions
      const leagues = await this.fetchLeagues();
      const allTeams: NormalizedTeam[] = [];
      const seenIds = new Set<string>();

      // Step 2: Loop through each competition and fetch teams
      for (const league of leagues) {
        try {
          const data = await this.fetchApi<{ teams: FootballDataTeam[] }>(`/competitions/${league.externalId}/teams`);
          const teams = data.teams || [];

          for (const t of teams) {
            const id = t.id.toString();
            if (!seenIds.has(id)) {
              seenIds.add(id);
              allTeams.push({
                externalId: id,
                sourceName: this.getSourceName(),
                name: t.name,
                shortName: t.shortName,
                tla: t.tla,
                country: t.area?.name,
                crestUrl: t.crest,
                foundedYear: t.founded,
                venueName: t.venue,
                website: t.website
              });
            }
          }
        } catch (teamError: any) {
          // Some competitions may not allow team listing on free tier — skip gracefully
          console.warn(`[${this.getSourceName()}] Skipping teams for competition ${league.code}: ${teamError.message}`);
        }
      }

      return allTeams;
    } catch (error: any) {
      console.error(`[${this.getSourceName()}] fetchTeams error:`, error);
      throw error;
    }
  }

  async fetchPlayers(): Promise<NormalizedPlayer[]> {
    // Player endpoints require premium tier on football-data.org
    // Return empty array until premium API is available
    console.info(`[${this.getSourceName()}] fetchPlayers: Premium API required. Returning empty.`);
    return [];
  }

  async ping(): Promise<boolean> {
    try {
      // Smallest payload to test connection/auth
      await this.fetchApi('/competitions?areas=2077'); 
      return true;
    } catch (error) {
      return false;
    }
  }

  private mapCompetitionType(type?: string): 'LEAGUE' | 'CUP' | 'SUPER_CUP' | 'PLAYOFFS' {
    if (!type) return 'LEAGUE';
    switch (type.toUpperCase()) {
      case 'CUP': return 'CUP';
      case 'SUPER_CUP': return 'SUPER_CUP';
      case 'PLAYOFFS': return 'PLAYOFFS';
      default: return 'LEAGUE';
    }
  }
}
