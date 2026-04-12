/**
 * Normalized representation of a Football Match from any external API
 */
export interface NormalizedMatch {
  externalId: string;
  sourceName: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  status: 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED' | 'EXTRA_TIME' | 'PENALTY_SHOOTOUT' | 'FINISHED' | 'SUSPENDED' | 'POSTPONED' | 'CANCELLED' | 'AWARDED';
  score: {
    home: number | null;
    away: number | null;
    halfTimeHome?: number | null;
    halfTimeAway?: number | null;
  };
}

export interface IExternalFootballService {
  /**
   * Identifies the source (e.g. 'football-data.org', 'thesportsdb')
   */
  getSourceName(): string;

  /**
   * Fetches matches from the external API and normalizes them
   */
  fetchLiveMatches(): Promise<NormalizedMatch[]>;

  /**
   * Check connection status
   */
  ping(): Promise<boolean>;
}
