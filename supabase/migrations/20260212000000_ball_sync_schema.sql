-- BallSync Multi-Source Aggregator Schema
-- Created: 2026-02-12
-- Description: Schema for centralized football data aggregation

-- Enums for sync status and match status
DO $$ BEGIN
    CREATE TYPE public.sync_log_status AS ENUM ('success', 'failed', 'partial');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.match_status AS ENUM ('SCHEDULED', 'IN_PLAY', 'FINISHED', 'PAUSED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Unified Tables (The "Golden Record")
CREATE TABLE IF NOT EXISTS public.unified_matches (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    league_name_en TEXT,
    league_name_th TEXT,
    home_team_name_en TEXT NOT NULL,
    home_team_name_th TEXT,
    away_team_name_en TEXT NOT NULL,
    away_team_name_th TEXT,
    match_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status public.match_status NOT NULL DEFAULT 'SCHEDULED',
    home_score INTEGER,
    away_score INTEGER,
    half_time_home INTEGER,
    half_time_away INTEGER,
    last_updated_by_source TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Source Tables (Data preserved per source)
CREATE TABLE IF NOT EXISTS public.source_matches (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    source_name TEXT NOT NULL,
    external_id TEXT NOT NULL,
    home_team_name TEXT,
    away_team_name TEXT,
    match_date TIMESTAMP WITH TIME ZONE,
    status TEXT,
    home_score INTEGER,
    away_score INTEGER,
    half_time_home INTEGER,
    half_time_away INTEGER,
    unified_match_id UUID REFERENCES public.unified_matches(id),
    raw_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(source_name, external_id)
);

-- 3. Mapping Tables (Entity Resolution)
CREATE TABLE IF NOT EXISTS public.match_mappings (
    source_name TEXT NOT NULL,
    external_id TEXT NOT NULL,
    unified_match_id UUID REFERENCES public.unified_matches(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (source_name, external_id)
);

-- 4. Sync Logs
CREATE TABLE IF NOT EXISTS public.sync_logs (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    source_name TEXT NOT NULL,
    status public.sync_log_status NOT NULL,
    records_processed INTEGER DEFAULT 0,
    duration_ms INTEGER,
    error_message TEXT,
    triggered_by TEXT NOT NULL CHECK (triggered_by IN ('cron', 'manual')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_unified_matches_date ON public.unified_matches(match_date);
CREATE INDEX IF NOT EXISTS idx_unified_matches_status ON public.unified_matches(status);
CREATE INDEX IF NOT EXISTS idx_source_matches_lookup ON public.source_matches(source_name, external_id);
CREATE INDEX IF NOT EXISTS idx_match_mappings_unified_id ON public.match_mappings(unified_match_id);

-- Triggers for updated_at
DO $$ BEGIN
    CREATE TRIGGER update_unified_matches_updated_at
    BEFORE UPDATE ON public.unified_matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_source_matches_updated_at
    BEFORE UPDATE ON public.source_matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
