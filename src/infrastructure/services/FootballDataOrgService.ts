import { IExternalFootballService, NormalizedMatch } from "@/src/application/services/IExternalFootballService";

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

  private mapStatus(strStatus?: string): 'SCHEDULED' | 'IN_PLAY' | 'FINISHED' | 'PAUSED' | 'CANCELLED' {
    if (!strStatus) return 'SCHEDULED';
    const status = strStatus.toUpperCase();
    
    // Football-data.org uses: SCHEDULED, TIMED, IN_PLAY, PAUSED, EXTRA_TIME, PENALTY_SHOOTOUT, FINISHED, SUSPENDED, POSTPONED, CANCELLED, AWARDED
    if (status === 'FINISHED' || status === 'AWARDED') return 'FINISHED';
    if (status === 'IN_PLAY' || status === 'EXTRA_TIME' || status === 'PENALTY_SHOOTOUT') return 'IN_PLAY';
    if (status === 'PAUSED' || status === 'SUSPENDED') return 'PAUSED';
    if (status === 'CANCELLED' || status === 'POSTPONED') return 'CANCELLED';
    
    // TIMED or SCHEDULED or anything else
    return 'SCHEDULED';
  }

  async fetchLiveMatches(): Promise<NormalizedMatch[]> {
    try {
      // Fetch today's matches (or IN_PLAY directly if the API supports it without premium filters)
      const data = await this.fetchApi<any>('/matches');
      const matches = data.matches || [];

      return matches.map((m: any) => ({
        externalId: m.id.toString(),
        sourceName: this.getSourceName(),
        homeTeam: m.homeTeam?.name || 'Unknown',
        awayTeam: m.awayTeam?.name || 'Unknown',
        matchDate: m.utcDate,
        status: this.mapStatus(m.status),
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

  async ping(): Promise<boolean> {
    try {
      // Smallest payload to test connection/auth
      await this.fetchApi('/competitions?areas=2077'); 
      return true;
    } catch (error) {
      return false;
    }
  }
}
