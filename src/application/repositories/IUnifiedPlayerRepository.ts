/**
 * UnifiedPlayer
 * The central "Golden Record" format for Players
 */
export interface UnifiedPlayer {
  id: string;
  nameEn: string;
  nameTh?: string;
  nationality?: string;
  position?: 'Goalkeeper' | 'Defence' | 'Midfield' | 'Offence';
  dateOfBirth?: string;
  shirtNumber?: number;
  teamId?: string;
  photoUrl?: string;
  lastUpdatedBySource: string;
  updatedAt: string;
  isApproved: boolean;
}

export interface UnifiedPlayerQuery {
  filters?: {
    teamId?: string;
    nationality?: string;
    position?: string;
    isApproved?: boolean;
  };
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  pagination?: {
    limit: number;
    offset?: number;
  };
}

export interface UnifiedPlayerQueryResult {
  data: UnifiedPlayer[];
  total?: number;
}

export interface IUnifiedPlayerRepository {
  query(params: UnifiedPlayerQuery): Promise<UnifiedPlayerQueryResult>;
  getById(id: string): Promise<UnifiedPlayer | null>;
  approveRecord(id: string): Promise<boolean>;
  mergeRecords(primaryId: string, duplicateId: string): Promise<boolean>;
  upsert(player: Partial<UnifiedPlayer>): Promise<UnifiedPlayer>;
}
