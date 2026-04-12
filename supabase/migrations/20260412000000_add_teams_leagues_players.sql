-- Multi-Domain Expansion: Teams, Leagues, Players
-- Created: 2026-04-12
-- Description: Extends the Golden Record pattern (unified → source → mapping) to Teams, Leagues, Players

-- ============================================================
-- TEAMS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.unified_teams (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name_en TEXT NOT NULL,
    name_th TEXT,
    short_name TEXT,
    tla TEXT,              -- Three-Letter Abbreviation (e.g. ARS, MCI)
    country TEXT,
    crest_url TEXT,
    founded_year INTEGER,
    venue_name TEXT,
    website TEXT,
    last_updated_by_source TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.source_teams (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    source_name TEXT NOT NULL,
    external_id TEXT NOT NULL,
    name TEXT,
    short_name TEXT,
    country TEXT,
    crest_url TEXT,
    unified_team_id UUID REFERENCES public.unified_teams(id),
    raw_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(source_name, external_id)
);

CREATE TABLE IF NOT EXISTS public.team_mappings (
    source_name TEXT NOT NULL,
    external_id TEXT NOT NULL,
    unified_team_id UUID REFERENCES public.unified_teams(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (source_name, external_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_unified_teams_name ON public.unified_teams(name_en);
CREATE INDEX IF NOT EXISTS idx_unified_teams_country ON public.unified_teams(country);
CREATE INDEX IF NOT EXISTS idx_source_teams_lookup ON public.source_teams(source_name, external_id);
CREATE INDEX IF NOT EXISTS idx_team_mappings_unified_id ON public.team_mappings(unified_team_id);

-- Triggers
DO $$ BEGIN
    CREATE TRIGGER update_unified_teams_updated_at
    BEFORE UPDATE ON public.unified_teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_source_teams_updated_at
    BEFORE UPDATE ON public.source_teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- LEAGUES (Competitions)
-- ============================================================

DO $$ BEGIN
    CREATE TYPE public.league_type AS ENUM ('LEAGUE', 'CUP', 'SUPER_CUP', 'PLAYOFFS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.unified_leagues (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name_en TEXT NOT NULL,
    name_th TEXT,
    code TEXT,              -- e.g. PL, PD, BL1, SA, FL1
    country TEXT,
    emblem_url TEXT,
    type public.league_type DEFAULT 'LEAGUE',
    current_season TEXT,    -- e.g. "2025-2026"
    last_updated_by_source TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.source_leagues (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    source_name TEXT NOT NULL,
    external_id TEXT NOT NULL,
    name TEXT,
    code TEXT,
    country TEXT,
    emblem_url TEXT,
    unified_league_id UUID REFERENCES public.unified_leagues(id),
    raw_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(source_name, external_id)
);

CREATE TABLE IF NOT EXISTS public.league_mappings (
    source_name TEXT NOT NULL,
    external_id TEXT NOT NULL,
    unified_league_id UUID REFERENCES public.unified_leagues(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (source_name, external_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_unified_leagues_name ON public.unified_leagues(name_en);
CREATE INDEX IF NOT EXISTS idx_unified_leagues_country ON public.unified_leagues(country);
CREATE INDEX IF NOT EXISTS idx_unified_leagues_code ON public.unified_leagues(code);
CREATE INDEX IF NOT EXISTS idx_source_leagues_lookup ON public.source_leagues(source_name, external_id);
CREATE INDEX IF NOT EXISTS idx_league_mappings_unified_id ON public.league_mappings(unified_league_id);

-- Triggers
DO $$ BEGIN
    CREATE TRIGGER update_unified_leagues_updated_at
    BEFORE UPDATE ON public.unified_leagues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_source_leagues_updated_at
    BEFORE UPDATE ON public.source_leagues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- PLAYERS
-- ============================================================

DO $$ BEGIN
    CREATE TYPE public.player_position AS ENUM ('Goalkeeper', 'Defence', 'Midfield', 'Offence');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.unified_players (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name_en TEXT NOT NULL,
    name_th TEXT,
    nationality TEXT,
    position public.player_position,
    date_of_birth DATE,
    shirt_number INTEGER,
    team_id UUID REFERENCES public.unified_teams(id),
    photo_url TEXT,
    last_updated_by_source TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.source_players (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    source_name TEXT NOT NULL,
    external_id TEXT NOT NULL,
    name TEXT,
    nationality TEXT,
    position TEXT,
    date_of_birth TEXT,
    unified_player_id UUID REFERENCES public.unified_players(id),
    raw_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(source_name, external_id)
);

CREATE TABLE IF NOT EXISTS public.player_mappings (
    source_name TEXT NOT NULL,
    external_id TEXT NOT NULL,
    unified_player_id UUID REFERENCES public.unified_players(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (source_name, external_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_unified_players_name ON public.unified_players(name_en);
CREATE INDEX IF NOT EXISTS idx_unified_players_team ON public.unified_players(team_id);
CREATE INDEX IF NOT EXISTS idx_unified_players_nationality ON public.unified_players(nationality);
CREATE INDEX IF NOT EXISTS idx_source_players_lookup ON public.source_players(source_name, external_id);
CREATE INDEX IF NOT EXISTS idx_player_mappings_unified_id ON public.player_mappings(unified_player_id);

-- Triggers
DO $$ BEGIN
    CREATE TRIGGER update_unified_players_updated_at
    BEFORE UPDATE ON public.unified_players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_source_players_updated_at
    BEFORE UPDATE ON public.source_players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
