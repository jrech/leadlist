-- ============================================================================
-- 0004_crm_tables.sql — companies, contacts
-- ============================================================================

-- ----------------------------------------------------------------------------
-- public.companies
-- ----------------------------------------------------------------------------
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  domain text,
  industry text,
  employee_count int,
  linkedin_url text,
  -- Flexible per-org custom attributes (enrichment data, scoring, etc.)
  -- without a schema migration for every new field a customer wants.
  custom_fields jsonb not null default '{}'::jsonb,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint companies_employee_count_check check (employee_count is null or employee_count >= 0)
);

comment on table public.companies is
  'A company/account record. Scoped to organization_id; a company in one org is a distinct row from the "same" company in another org — no cross-tenant sharing.';

-- One company per domain per org — prevents duplicate records when the
-- domain is known. Partial (domain is not null) because plenty of contacts
-- get added before their company's domain is known/enriched.
create unique index companies_org_domain_key
  on public.companies (organization_id, domain)
  where domain is not null;

-- ----------------------------------------------------------------------------
-- public.contacts
-- ----------------------------------------------------------------------------
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  company_id uuid references public.companies (id) on delete set null,
  -- Business ownership ("who's working this lead") — NOT a security
  -- boundary. Security/visibility is governed entirely by organization_id
  -- + RLS; owner_id is plain data used for "my pipeline" filters in the UI.
  owner_id uuid references public.users (id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  job_title text,
  linkedin_url text,
  status public.contact_status not null default 'new',
  custom_fields jsonb not null default '{}'::jsonb,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.contacts is
  'An outreach target (a person). owner_id is business ownership for UI filtering, not a security boundary — see organization_id / RLS for that.';

-- One contact per email per org (case-insensitive) — the natural dedup key
-- for cold outreach; you never want to enroll the same email address twice
-- under two different contact rows in the same org.
create unique index contacts_org_email_key
  on public.contacts (organization_id, lower(email));
