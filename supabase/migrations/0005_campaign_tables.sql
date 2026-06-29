-- ============================================================================
-- 0005_campaign_tables.sql — sequences, sequence_steps, email_accounts,
--                             campaigns, contact_campaigns
-- ============================================================================
-- Dependency order matters here: sequences and email_accounts are created
-- before campaigns because campaigns references both of them.

-- ----------------------------------------------------------------------------
-- public.sequences
-- ----------------------------------------------------------------------------
-- Design decision: sequences are reusable templates owned by the
-- organization, not 1:1 children of a single campaign. A campaign POINTS AT
-- a sequence (campaigns.sequence_id) rather than owning one inline. This
-- mirrors how Apollo/Outreach/Lemlist-style tools work in practice — "use
-- this sequence again for next month's campaign" is a real, common action,
-- and modeling it as 1:1 would mean duplicating sequence_steps rows every
-- time someone wants to reuse a winning sequence.
create table public.sequences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  description text,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.sequences is
  'Reusable outreach sequence template, owned by an organization. Campaigns reference a sequence; sequences do not belong to a single campaign.';

-- ----------------------------------------------------------------------------
-- public.sequence_steps
-- ----------------------------------------------------------------------------
create table public.sequence_steps (
  id uuid primary key default gen_random_uuid(),
  -- Denormalized from sequences.organization_id, populated by trigger
  -- (0007_functions_triggers.sql) — never trusted from the client. Exists
  -- purely so RLS policies here are a flat equality check, not a join.
  organization_id uuid not null references public.organizations (id) on delete cascade,
  sequence_id uuid not null references public.sequences (id) on delete cascade,
  step_number int not null,
  step_type public.sequence_step_type not null default 'email',
  subject text,
  body text,
  -- Days to wait after the previous step (or after enrollment, for step 1)
  -- before this step fires.
  wait_days int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sequence_steps_sequence_step_number_key unique (sequence_id, step_number),
  constraint sequence_steps_wait_days_check check (wait_days >= 0),
  constraint sequence_steps_step_number_check check (step_number >= 1)
);

comment on table public.sequence_steps is
  'One step in a sequence template. organization_id is denormalized from the parent sequence — see the trigger that maintains it.';

-- ----------------------------------------------------------------------------
-- public.email_accounts
-- ----------------------------------------------------------------------------
-- The sending mailboxes connected to an org. Deliberately more locked-down
-- than the CRM tables (see RLS in 0008) — only org admins/owners can
-- connect, edit, or remove a mailbox; regular members can see that it
-- exists (for campaign setup) but not manage it.
create table public.email_accounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  connected_by uuid references public.users (id) on delete set null,
  email_address text not null,
  provider public.email_provider not null,
  status public.email_account_status not null default 'connected',
  daily_send_limit int not null default 50,
  -- NEVER store the raw OAuth refresh token / SMTP password here. This
  -- column holds ciphertext produced by Supabase Vault (pgsodium) or an
  -- application-layer KMS; the encryption key never lives in this table or
  -- in application source. Decryption happens only in a trusted server
  -- context (a Postgres function using pgsodium, or your backend), never
  -- via a client-exposed query.
  oauth_refresh_token_encrypted text,
  warmup_started_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint email_accounts_org_email_key unique (organization_id, email_address),
  constraint email_accounts_daily_limit_check check (daily_send_limit > 0)
);

comment on table public.email_accounts is
  'Connected sending mailboxes. oauth_refresh_token_encrypted must be ciphertext (pgsodium/Vault) — this column is never readable as plaintext by RLS-governed clients.';

-- ----------------------------------------------------------------------------
-- public.campaigns
-- ----------------------------------------------------------------------------
create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  sequence_id uuid references public.sequences (id) on delete set null,
  email_account_id uuid references public.email_accounts (id) on delete set null,
  name text not null,
  status public.campaign_status not null default 'draft',
  -- Per-campaign scheduling/sending settings (timezone, send window,
  -- max-per-day, etc.). jsonb so product can ship new settings without a
  -- migration; promote a field to a real column once it needs to be
  -- queried/indexed on its own.
  settings jsonb not null default '{}'::jsonb,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.campaigns is
  'An outreach campaign: a sequence + a sending mailbox + scheduling settings, run against a set of enrolled contacts (see contact_campaigns).';

-- ----------------------------------------------------------------------------
-- public.contact_campaigns
-- ----------------------------------------------------------------------------
-- The enrollment join table — the busiest, most performance-sensitive table
-- in this schema. A sending worker polls this constantly to find contacts
-- whose next step is due (see the partial index in 0006_indexes.sql).
create table public.contact_campaigns (
  id uuid primary key default gen_random_uuid(),
  -- Denormalized from contact/campaign's organization_id (they must match —
  -- enforced by trigger, see 0007). Same rationale as sequence_steps: flat,
  -- fast, simple-to-secure column instead of a join in every RLS check.
  organization_id uuid not null references public.organizations (id) on delete cascade,
  contact_id uuid not null references public.contacts (id) on delete cascade,
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  current_step_id uuid references public.sequence_steps (id) on delete set null,
  status public.enrollment_status not null default 'active',
  enrolled_at timestamptz not null default now(),
  next_action_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- A contact can only be enrolled once per campaign — re-enrollment is a
  -- product decision (e.g. "reset and restart"), not a duplicate row.
  constraint contact_campaigns_contact_campaign_key unique (contact_id, campaign_id)
);

comment on table public.contact_campaigns is
  'Enrollment of a contact into a campaign + their progress through its sequence. The hot path for any sending worker — see the partial "due" index.';
