/**
 * Normalized representation of a Football Match from any external API
 */
export interface NormalizedMatch {
  externalId: string;
  sourceName: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  leagueName?: string;
  leagueExternalId?: string;
  stage?: string;
  group?: string;
  status: 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED' | 'EXTRA_TIME' | 'PENALTY_SHOOTOUT' | 'FINISHED' | 'SUSPENDED' | 'POSTPONED' | 'CANCELLED' | 'AWARDED';
  score: {
    home: number | null;
    away: number | null;
    halfTimeHome?: number | null;
    halfTimeAway?: number | null;
    extraTimeHome?: number | null;
    extraTimeAway?: number | null;
    penaltiesHome?: number | null;
    penaltiesAway?: number | null;
  };
}

/**
 * Normalized representation of a Football Team from any external API
 */
export interface NormalizedTeam {
  externalId: string;
  sourceName: string;
  name: string;
  shortName?: string;
  tla?: string;
  country?: string;
  crestUrl?: string;
  foundedYear?: number;
  venueName?: string;
  website?: string;
}

/**
 * Normalized representation of a League/Competition from any external API
 */
export interface NormalizedLeague {
  externalId: string;
  sourceName: string;
  name: string;
  code?: string;
  country?: string;
  emblemUrl?: string;
  type?: 'LEAGUE' | 'CUP' | 'SUPER_CUP' | 'PLAYOFFS';
  currentSeason?: string;
}

/**
 * Normalized representation of a Player from any external API
 */
export interface NormalizedPlayer {
  externalId: string;
  sourceName: string;
  name: string;
  nationality?: string;
  position?: 'Goalkeeper' | 'Defence' | 'Midfield' | 'Offence';
  dateOfBirth?: string;
  shirtNumber?: number;
  teamExternalId?: string;
  photoUrl?: string;
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
   * Fetches teams from the external API
   */
  fetchTeams(): Promise<NormalizedTeam[]>;

  /**
   * Fetches leagues/competitions from the external API
   */
  fetchLeagues(): Promise<NormalizedLeague[]>;

  /**
   * Fetches players from the external API
   * Note: May return empty array on free tier APIs
   */
  fetchPlayers(): Promise<NormalizedPlayer[]>;

  /**
   * Check connection status
   */
  ping(): Promise<boolean>;
}
