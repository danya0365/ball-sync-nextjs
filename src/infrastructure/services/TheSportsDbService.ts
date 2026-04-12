import { IExternalFootballService, NormalizedMatch, NormalizedTeam, NormalizedLeague, NormalizedPlayer } from "@/src/application/services/IExternalFootballService";

export interface TheSportsDbEvent {
  idEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  idLeague?: string;
  strLeague?: string;
  strTimestamp?: string;
  dateEvent?: string;
  strStatus?: string;
  intHomeScore?: string;
  intAwayScore?: string;
}

export interface TheSportsDbResponse {
  events: TheSportsDbEvent[] | null;
}

interface TheSportsDbTeam {
  idTeam: string;
  strTeam: string;
  strTeamShort?: string;
  strCountry?: string;
  strBadge?: string;
  intFormedYear?: string;
  strStadium?: string;
  strWebsite?: string;
}

interface TheSportsDbLeague {
  idLeague: string;
  strLeague: string;
  strCountry?: string;
  strBadge?: string;
  strCurrentSeason?: string;
}

export class TheSportsDbService implements IExternalFootballService {
  // Use public tier "3" API by default if key is not provided
  private readonly baseUrl = process.env.THESPORTSDB_BASE_URL || 'https://www.thesportsdb.com/api/v1/json/3';
  
  private requestCount: number = 0;
  private lastRequestTime: number = Date.now();

  getSourceName(): string {
    return 'thesportsdb.com';
  }

  /**
   * Check rate limit to be respectful of free APIs (e.g. 10 requests per minute)
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
      cache: 'no-store'
    });

    if (!response.ok) {
      const message = await response.text();
      switch (response.status) {
        case 400: throw new Error(`Bad Request: ${message}`);
        case 403: throw new Error("Forbidden: Invalid API key or endpoint access");
        case 404: throw new Error(`Not Found: ${message}`);
        case 429: throw new Error("Too Many Requests: Rate limit exceeded");
        default: throw new Error(`API Error (${response.status}): ${message}`);
      }
    }

    return response.json();
  }

  private mapStatus(strStatus?: string): 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED' | 'EXTRA_TIME' | 'PENALTY_SHOOTOUT' | 'FINISHED' | 'SUSPENDED' | 'POSTPONED' | 'CANCELLED' | 'AWARDED' {
    if (!strStatus) return 'SCHEDULED';
    const status = strStatus.toUpperCase();
    
    if (status.includes('FINISH') || status === 'FT') return 'FINISHED';
    if (status.includes('PLAY') || status.includes('HALF') || status === 'HT') return 'IN_PLAY';
    if (status.includes('POSTPONED') || status.includes('CANCEL')) return 'CANCELLED';
    if (status.includes('PAUSE')) return 'PAUSED';
    
    return 'SCHEDULED';
  }

  async fetchLiveMatches(): Promise<NormalizedMatch[]> {
    try {
      // Free tier: get today's matches. Note: Live ticker requires premium API.
      const today = new Date().toISOString().split('T')[0];
      const data = await this.fetchApi<TheSportsDbResponse>(`/eventsday.php?d=${today}&s=Soccer`);
      const events = data.events || [];

      return events.map((event: TheSportsDbEvent) => ({
        externalId: event.idEvent,
        sourceName: this.getSourceName(),
        homeTeam: event.strHomeTeam,
        awayTeam: event.strAwayTeam,
        leagueName: event.strLeague,
        leagueExternalId: event.idLeague,
        matchDate: event.strTimestamp || event.dateEvent || new Date().toISOString(),
        status: this.mapStatus(event.strStatus),
        score: {
          home: event.intHomeScore ? parseInt(event.intHomeScore, 10) : null,
          away: event.intAwayScore ? parseInt(event.intAwayScore, 10) : null,
          halfTimeHome: null, // Depending on API tier, might not be provided in free
          halfTimeAway: null
        }
      }));
    } catch (error: any) {
      console.error(`[${this.getSourceName()}] fetchLiveMatches error:`, error);
      throw error;
    }
  }

  async fetchLeagues(): Promise<NormalizedLeague[]> {
    try {
      // Search major football countries
      const countries = ['England', 'Spain', 'Germany', 'Italy', 'France'];
      const allLeagues: NormalizedLeague[] = [];
      const seenIds = new Set<string>();

      for (const country of countries) {
        try {
          const data = await this.fetchApi<{ countries: TheSportsDbLeague[] | null }>(
            `/search_all_leagues.php?c=${encodeURIComponent(country)}&s=Soccer`
          );
          const leagues = data.countries || [];
          
          for (const l of leagues) {
            if (!seenIds.has(l.idLeague)) {
              seenIds.add(l.idLeague);
              allLeagues.push({
                externalId: l.idLeague,
                sourceName: this.getSourceName(),
                name: l.strLeague,
                country: l.strCountry,
                emblemUrl: l.strBadge,
                type: 'LEAGUE',
                currentSeason: l.strCurrentSeason
              });
            }
          }
        } catch (leagueError: any) {
          console.warn(`[${this.getSourceName()}] Skipping leagues for ${country}: ${leagueError.message}`);
        }
      }

      return allLeagues;
    } catch (error: any) {
      console.error(`[${this.getSourceName()}] fetchLeagues error:`, error);
      throw error;
    }
  }

  async fetchTeams(): Promise<NormalizedTeam[]> {
    try {
      // Step 1: Get leagues first to find league names for team search
      const leagues = await this.fetchLeagues();
      const allTeams: NormalizedTeam[] = [];
      const seenIds = new Set<string>();

      // Step 2: Loop through each league to fetch teams
      for (const league of leagues) {
        try {
          const data = await this.fetchApi<{ teams: TheSportsDbTeam[] | null }>(
            `/search_all_teams.php?l=${encodeURIComponent(league.name)}`
          );
          const teams = data.teams || [];

          for (const t of teams) {
            if (!seenIds.has(t.idTeam)) {
              seenIds.add(t.idTeam);
              allTeams.push({
                externalId: t.idTeam,
                sourceName: this.getSourceName(),
                name: t.strTeam,
                shortName: t.strTeamShort,
                country: t.strCountry,
                crestUrl: t.strBadge,
                foundedYear: t.intFormedYear ? parseInt(t.intFormedYear, 10) : undefined,
                venueName: t.strStadium,
                website: t.strWebsite
              });
            }
          }
        } catch (teamError: any) {
          console.warn(`[${this.getSourceName()}] Skipping teams for league ${league.name}: ${teamError.message}`);
        }
      }

      return allTeams;
    } catch (error: any) {
      console.error(`[${this.getSourceName()}] fetchTeams error:`, error);
      throw error;
    }
  }

  async fetchPlayers(): Promise<NormalizedPlayer[]> {
    // Player search requires specific team lookup on free tier
    // Full player sync will be available with premium API
    console.info(`[${this.getSourceName()}] fetchPlayers: Premium API required for bulk. Returning empty.`);
    return [];
  }

  async ping(): Promise<boolean> {
    try {
      // Test the search endpoint for connectivity
      await this.fetchApi('/search_all_leagues.php?c=England&s=Soccer');
      return true;
    } catch (error) {
      return false;
    }
  }
}
