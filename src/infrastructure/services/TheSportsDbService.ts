import { IExternalFootballService, NormalizedMatch } from "@/src/application/services/IExternalFootballService";

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

  private mapStatus(strStatus?: string): 'SCHEDULED' | 'IN_PLAY' | 'FINISHED' | 'PAUSED' | 'CANCELLED' {
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
      const data = await this.fetchApi<any>(`/eventsday.php?d=${today}&s=Soccer`);
      const events = data.events || [];

      return events.map((event: any) => ({
        externalId: event.idEvent,
        sourceName: this.getSourceName(),
        homeTeam: event.strHomeTeam,
        awayTeam: event.strAwayTeam,
        matchDate: event.strTimestamp || event.dateEvent, // ISO String preferably
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
