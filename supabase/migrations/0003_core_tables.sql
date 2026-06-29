-- ============================================================================
-- 0003_core_tables.sql — users, organizations, organization_members
-- ============================================================================
-- Order matters: users first (everything else's created_by/owner_id points
-- here), then organizations (the tenant boundary), then organization_members
-- (the join table that actually grants access to everything else).

-- ----------------------------------------------------------------------------
-- public.users
-- ----------------------------------------------------------------------------
-- Supabase Auth owns `auth.users` (credentials, sessions, providers) and
-- doesn't allow extending it directly. The standard pattern — used here —
-- is a `public` table whose primary key IS the auth user's id, populated
-- automatically by a trigger on auth.users (see 0007_functions_triggers.sql).
-- This table holds only app-facing profile data, never credentials.
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.users is
  'App-facing profile data, one row per auth.users row. Never stores credentials — Supabase Auth owns those.';

-- ----------------------------------------------------------------------------
-- public.organizations
-- ----------------------------------------------------------------------------
-- The tenant boundary. Every piece of CRM/campaign data belongs to exactly
-- one organization; access is governed by membership, not by who created
-- the row. created_by is nullable + ON DELETE SET NULL so the organization
-- (and all its data) outlives the deletion of the user who happened to
-- create it.
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.organizations is
  'Tenant boundary. All CRM/campaign data is scoped to an organization via organization_id, never to a single user.';
comment on column public.organizations.slug is
  'URL-safe unique identifier (e.g. for /org/{slug} routing). Application is responsible for slugifying on insert.';

-- ----------------------------------------------------------------------------
-- public.organization_members
-- ----------------------------------------------------------------------------
-- A user can belong to multiple organizations (agencies managing several
-- client workspaces, consultants, etc.), so this is a true many-to-many
-- join, not a single org_id column on users. Composite primary key — a
-- user has at most one membership row (and therefore one role) per org.
create table public.organization_members (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  role public.org_role not null default 'member',
  invited_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

comment on table public.organization_members is
  'Many-to-many membership + role. The single source of truth every RLS policy in this schema ultimately checks.';
