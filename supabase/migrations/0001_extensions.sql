-- ============================================================================
-- 0001_extensions.sql
-- ============================================================================
-- pgcrypto provides gen_random_uuid(), used as the default for every
-- primary key in this schema. Supabase enables this on new projects by
-- default; declared explicitly here so the migration is reproducible on a
-- bare Postgres instance too.
create extension if not exists "pgcrypto";
