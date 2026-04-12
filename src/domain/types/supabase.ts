export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      league_mappings: {
        Row: {
          created_at: string | null
          external_id: string
          source_name: string
          unified_league_id: string | null
        }
        Insert: {
          created_at?: string | null
          external_id: string
          source_name: string
          unified_league_id?: string | null
        }
        Update: {
          created_at?: string | null
          external_id?: string
          source_name?: string
          unified_league_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "league_mappings_unified_league_id_fkey"
            columns: ["unified_league_id"]
            isOneToOne: false
            referencedRelation: "unified_leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      match_mappings: {
        Row: {
          created_at: string | null
          external_id: string
          source_name: string
          unified_match_id: string | null
        }
        Insert: {
          created_at?: string | null
          external_id: string
          source_name: string
          unified_match_id?: string | null
        }
        Update: {
          created_at?: string | null
          external_id?: string
          source_name?: string
          unified_match_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_mappings_unified_match_id_fkey"
            columns: ["unified_match_id"]
            isOneToOne: false
            referencedRelation: "unified_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      player_mappings: {
        Row: {
          created_at: string | null
          external_id: string
          source_name: string
          unified_player_id: string | null
        }
        Insert: {
          created_at?: string | null
          external_id: string
          source_name: string
          unified_player_id?: string | null
        }
        Update: {
          created_at?: string | null
          external_id?: string
          source_name?: string
          unified_player_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_mappings_unified_player_id_fkey"
            columns: ["unified_player_id"]
            isOneToOne: false
            referencedRelation: "unified_players"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_roles: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          profile_id: string
          role: Database["public"]["Enums"]["profile_role"]
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          profile_id: string
          role?: Database["public"]["Enums"]["profile_role"]
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["profile_role"]
        }
        Relationships: [
          {
            foreignKeyName: "profile_roles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          auth_id: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_active: boolean
          last_login: string | null
          login_count: number
          phone: string | null
          preferences: Json
          privacy_settings: Json
          social_links: Json | null
          updated_at: string | null
          username: string | null
          verification_status: string
        }
        Insert: {
          address?: string | null
          auth_id: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean
          last_login?: string | null
          login_count?: number
          phone?: string | null
          preferences?: Json
          privacy_settings?: Json
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
          verification_status?: string
        }
        Update: {
          address?: string | null
          auth_id?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean
          last_login?: string | null
          login_count?: number
          phone?: string | null
          preferences?: Json
          privacy_settings?: Json
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
          verification_status?: string
        }
        Relationships: []
      }
      source_leagues: {
        Row: {
          code: string | null
          country: string | null
          created_at: string | null
          emblem_url: string | null
          external_id: string
          id: string
          name: string | null
          raw_data: Json | null
          source_name: string
          unified_league_id: string | null
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          country?: string | null
          created_at?: string | null
          emblem_url?: string | null
          external_id: string
          id?: string
          name?: string | null
          raw_data?: Json | null
          source_name: string
          unified_league_id?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          country?: string | null
          created_at?: string | null
          emblem_url?: string | null
          external_id?: string
          id?: string
          name?: string | null
          raw_data?: Json | null
          source_name?: string
          unified_league_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "source_leagues_unified_league_id_fkey"
            columns: ["unified_league_id"]
            isOneToOne: false
            referencedRelation: "unified_leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      source_matches: {
        Row: {
          away_score: number | null
          away_team_name: string | null
          created_at: string | null
          external_id: string
          extra_time_away: number | null
          extra_time_home: number | null
          group_name: string | null
          half_time_away: number | null
          half_time_home: number | null
          home_score: number | null
          home_team_name: string | null
          id: string
          match_date: string | null
          match_stage: string | null
          matchday: number | null
          penalties_away: number | null
          penalties_home: number | null
          raw_data: Json | null
          referee_name: string | null
          score_duration: string | null
          score_winner: string | null
          season: string | null
          source_name: string
          status: string | null
          unified_match_id: string | null
          updated_at: string | null
          venue_name: string | null
        }
        Insert: {
          away_score?: number | null
          away_team_name?: string | null
          created_at?: string | null
          external_id: string
          extra_time_away?: number | null
          extra_time_home?: number | null
          group_name?: string | null
          half_time_away?: number | null
          half_time_home?: number | null
          home_score?: number | null
          home_team_name?: string | null
          id?: string
          match_date?: string | null
          match_stage?: string | null
          matchday?: number | null
          penalties_away?: number | null
          penalties_home?: number | null
          raw_data?: Json | null
          referee_name?: string | null
          score_duration?: string | null
          score_winner?: string | null
          season?: string | null
          source_name: string
          status?: string | null
          unified_match_id?: string | null
          updated_at?: string | null
          venue_name?: string | null
        }
        Update: {
          away_score?: number | null
          away_team_name?: string | null
          created_at?: string | null
          external_id?: string
          extra_time_away?: number | null
          extra_time_home?: number | null
          group_name?: string | null
          half_time_away?: number | null
          half_time_home?: number | null
          home_score?: number | null
          home_team_name?: string | null
          id?: string
          match_date?: string | null
          match_stage?: string | null
          matchday?: number | null
          penalties_away?: number | null
          penalties_home?: number | null
          raw_data?: Json | null
          referee_name?: string | null
          score_duration?: string | null
          score_winner?: string | null
          season?: string | null
          source_name?: string
          status?: string | null
          unified_match_id?: string | null
          updated_at?: string | null
          venue_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "source_matches_unified_match_id_fkey"
            columns: ["unified_match_id"]
            isOneToOne: false
            referencedRelation: "unified_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      source_players: {
        Row: {
          created_at: string | null
          date_of_birth: string | null
          external_id: string
          id: string
          name: string | null
          nationality: string | null
          position: string | null
          raw_data: Json | null
          source_name: string
          unified_player_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_birth?: string | null
          external_id: string
          id?: string
          name?: string | null
          nationality?: string | null
          position?: string | null
          raw_data?: Json | null
          source_name: string
          unified_player_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_birth?: string | null
          external_id?: string
          id?: string
          name?: string | null
          nationality?: string | null
          position?: string | null
          raw_data?: Json | null
          source_name?: string
          unified_player_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "source_players_unified_player_id_fkey"
            columns: ["unified_player_id"]
            isOneToOne: false
            referencedRelation: "unified_players"
            referencedColumns: ["id"]
          },
        ]
      }
      source_teams: {
        Row: {
          country: string | null
          created_at: string | null
          crest_url: string | null
          external_id: string
          id: string
          name: string | null
          raw_data: Json | null
          short_name: string | null
          source_name: string
          unified_team_id: string | null
          updated_at: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          crest_url?: string | null
          external_id: string
          id?: string
          name?: string | null
          raw_data?: Json | null
          short_name?: string | null
          source_name: string
          unified_team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          crest_url?: string | null
          external_id?: string
          id?: string
          name?: string | null
          raw_data?: Json | null
          short_name?: string | null
          source_name?: string
          unified_team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "source_teams_unified_team_id_fkey"
            columns: ["unified_team_id"]
            isOneToOne: false
            referencedRelation: "unified_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_logs: {
        Row: {
          created_at: string | null
          duration_ms: number | null
          error_message: string | null
          id: string
          records_processed: number | null
          source_name: string
          status: Database["public"]["Enums"]["sync_log_status"]
          triggered_by: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          records_processed?: number | null
          source_name: string
          status: Database["public"]["Enums"]["sync_log_status"]
          triggered_by: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          records_processed?: number | null
          source_name?: string
          status?: Database["public"]["Enums"]["sync_log_status"]
          triggered_by?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      team_mappings: {
        Row: {
          created_at: string | null
          external_id: string
          source_name: string
          unified_team_id: string | null
        }
        Insert: {
          created_at?: string | null
          external_id: string
          source_name: string
          unified_team_id?: string | null
        }
        Update: {
          created_at?: string | null
          external_id?: string
          source_name?: string
          unified_team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_mappings_unified_team_id_fkey"
            columns: ["unified_team_id"]
            isOneToOne: false
            referencedRelation: "unified_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      unified_leagues: {
        Row: {
          code: string | null
          country: string | null
          created_at: string | null
          current_season: string | null
          emblem_url: string | null
          id: string
          is_approved: boolean | null
          last_updated_by_source: string | null
          metadata: Json | null
          name_en: string
          name_th: string | null
          type: Database["public"]["Enums"]["league_type"] | null
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          country?: string | null
          created_at?: string | null
          current_season?: string | null
          emblem_url?: string | null
          id?: string
          is_approved?: boolean | null
          last_updated_by_source?: string | null
          metadata?: Json | null
          name_en: string
          name_th?: string | null
          type?: Database["public"]["Enums"]["league_type"] | null
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          country?: string | null
          created_at?: string | null
          current_season?: string | null
          emblem_url?: string | null
          id?: string
          is_approved?: boolean | null
          last_updated_by_source?: string | null
          metadata?: Json | null
          name_en?: string
          name_th?: string | null
          type?: Database["public"]["Enums"]["league_type"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      unified_matches: {
        Row: {
          away_score: number | null
          away_team_name_en: string
          away_team_name_th: string | null
          created_at: string | null
          extra_time_away: number | null
          extra_time_home: number | null
          group_name: string | null
          half_time_away: number | null
          half_time_home: number | null
          home_score: number | null
          home_team_name_en: string
          home_team_name_th: string | null
          id: string
          is_approved: boolean | null
          last_updated_by_source: string | null
          league_name_en: string | null
          league_name_th: string | null
          match_date: string
          match_stage: string | null
          matchday: number | null
          metadata: Json | null
          penalties_away: number | null
          penalties_home: number | null
          referee_name: string | null
          score_duration: string | null
          score_winner: string | null
          season: string | null
          status: Database["public"]["Enums"]["match_status"]
          updated_at: string | null
          venue_name: string | null
        }
        Insert: {
          away_score?: number | null
          away_team_name_en: string
          away_team_name_th?: string | null
          created_at?: string | null
          extra_time_away?: number | null
          extra_time_home?: number | null
          group_name?: string | null
          half_time_away?: number | null
          half_time_home?: number | null
          home_score?: number | null
          home_team_name_en: string
          home_team_name_th?: string | null
          id?: string
          is_approved?: boolean | null
          last_updated_by_source?: string | null
          league_name_en?: string | null
          league_name_th?: string | null
          match_date: string
          match_stage?: string | null
          matchday?: number | null
          metadata?: Json | null
          penalties_away?: number | null
          penalties_home?: number | null
          referee_name?: string | null
          score_duration?: string | null
          score_winner?: string | null
          season?: string | null
          status?: Database["public"]["Enums"]["match_status"]
          updated_at?: string | null
          venue_name?: string | null
        }
        Update: {
          away_score?: number | null
          away_team_name_en?: string
          away_team_name_th?: string | null
          created_at?: string | null
          extra_time_away?: number | null
          extra_time_home?: number | null
          group_name?: string | null
          half_time_away?: number | null
          half_time_home?: number | null
          home_score?: number | null
          home_team_name_en?: string
          home_team_name_th?: string | null
          id?: string
          is_approved?: boolean | null
          last_updated_by_source?: string | null
          league_name_en?: string | null
          league_name_th?: string | null
          match_date?: string
          match_stage?: string | null
          matchday?: number | null
          metadata?: Json | null
          penalties_away?: number | null
          penalties_home?: number | null
          referee_name?: string | null
          score_duration?: string | null
          score_winner?: string | null
          season?: string | null
          status?: Database["public"]["Enums"]["match_status"]
          updated_at?: string | null
          venue_name?: string | null
        }
        Relationships: []
      }
      unified_players: {
        Row: {
          created_at: string | null
          date_of_birth: string | null
          id: string
          is_approved: boolean | null
          last_updated_by_source: string | null
          metadata: Json | null
          name_en: string
          name_th: string | null
          nationality: string | null
          photo_url: string | null
          position: Database["public"]["Enums"]["player_position"] | null
          shirt_number: number | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_birth?: string | null
          id?: string
          is_approved?: boolean | null
          last_updated_by_source?: string | null
          metadata?: Json | null
          name_en: string
          name_th?: string | null
          nationality?: string | null
          photo_url?: string | null
          position?: Database["public"]["Enums"]["player_position"] | null
          shirt_number?: number | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_birth?: string | null
          id?: string
          is_approved?: boolean | null
          last_updated_by_source?: string | null
          metadata?: Json | null
          name_en?: string
          name_th?: string | null
          nationality?: string | null
          photo_url?: string | null
          position?: Database["public"]["Enums"]["player_position"] | null
          shirt_number?: number | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unified_players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "unified_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      unified_teams: {
        Row: {
          country: string | null
          created_at: string | null
          crest_url: string | null
          founded_year: number | null
          id: string
          is_approved: boolean | null
          last_updated_by_source: string | null
          metadata: Json | null
          name_en: string
          name_th: string | null
          short_name: string | null
          tla: string | null
          updated_at: string | null
          venue_name: string | null
          website: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          crest_url?: string | null
          founded_year?: number | null
          id?: string
          is_approved?: boolean | null
          last_updated_by_source?: string | null
          metadata?: Json | null
          name_en: string
          name_th?: string | null
          short_name?: string | null
          tla?: string | null
          updated_at?: string | null
          venue_name?: string | null
          website?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          crest_url?: string | null
          founded_year?: number | null
          id?: string
          is_approved?: boolean | null
          last_updated_by_source?: string | null
          metadata?: Json | null
          name_en?: string
          name_th?: string | null
          short_name?: string | null
          tla?: string | null
          updated_at?: string | null
          venue_name?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_profile: {
        Args: { avatar_url?: string; full_name?: string; username: string }
        Returns: string
      }
      get_active_profile: {
        Args: never
        Returns: {
          address: string | null
          auth_id: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_active: boolean
          last_login: string | null
          login_count: number
          phone: string | null
          preferences: Json
          privacy_settings: Json
          social_links: Json | null
          updated_at: string | null
          username: string | null
          verification_status: string
        }[]
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_active_profile_id: { Args: never; Returns: string }
      get_active_profile_role: {
        Args: never
        Returns: Database["public"]["Enums"]["profile_role"]
      }
      get_auth_user_by_id: { Args: { p_id: string }; Returns: Json }
      get_paginated_users: {
        Args: { p_limit?: number; p_page?: number }
        Returns: Json
      }
      get_private_url: {
        Args: { bucket: string; expires_in?: number; object_path: string }
        Returns: string
      }
      get_profile_role: {
        Args: { profile_id: string }
        Returns: Database["public"]["Enums"]["profile_role"]
      }
      get_user_profiles: {
        Args: never
        Returns: {
          address: string | null
          auth_id: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_active: boolean
          last_login: string | null
          login_count: number
          phone: string | null
          preferences: Json
          privacy_settings: Json
          social_links: Json | null
          updated_at: string | null
          username: string | null
          verification_status: string
        }[]
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      is_admin: { Args: never; Returns: boolean }
      is_instructor_or_admin: { Args: never; Returns: boolean }
      is_service_role: { Args: never; Returns: boolean }
      migrate_profile_roles: { Args: never; Returns: undefined }
      set_profile_active: { Args: { profile_id: string }; Returns: boolean }
      set_profile_role: {
        Args: {
          new_role: Database["public"]["Enums"]["profile_role"]
          target_profile_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      league_type: "LEAGUE" | "CUP" | "SUPER_CUP" | "PLAYOFFS"
      match_status:
        | "SCHEDULED"
        | "TIMED"
        | "IN_PLAY"
        | "PAUSED"
        | "EXTRA_TIME"
        | "PENALTY_SHOOTOUT"
        | "FINISHED"
        | "SUSPENDED"
        | "POSTPONED"
        | "CANCELLED"
        | "AWARDED"
      player_position: "Goalkeeper" | "Defence" | "Midfield" | "Offence"
      profile_role: "student" | "instructor" | "admin"
      sync_log_status: "success" | "failed" | "partial"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      league_type: ["LEAGUE", "CUP", "SUPER_CUP", "PLAYOFFS"],
      match_status: [
        "SCHEDULED",
        "TIMED",
        "IN_PLAY",
        "PAUSED",
        "EXTRA_TIME",
        "PENALTY_SHOOTOUT",
        "FINISHED",
        "SUSPENDED",
        "POSTPONED",
        "CANCELLED",
        "AWARDED",
      ],
      player_position: ["Goalkeeper", "Defence", "Midfield", "Offence"],
      profile_role: ["student", "instructor", "admin"],
      sync_log_status: ["success", "failed", "partial"],
    },
  },
} as const

