-- ============================================================================
-- 0002_enum_types.sql
-- ============================================================================
-- Native enums for stable, small status vocabularies. Smaller on disk and
-- self-documenting versus text + CHECK; the trade-off is that adding a new
-- value later requires an `ALTER TYPE ... ADD VALUE` migration rather than
-- just relaxing a constraint. Acceptable here — these vocabularies are
-- well-understood domain concepts, not things product will redesign weekly.

-- Membership role within an organization. Drives every admin-gated RLS
-- policy in this schema (see is_org_admin / is_org_owner helpers).
create type public.org_role as enum ('owner', 'admin', 'member');

-- Lifecycle of an outreach campaign.
create type public.campaign_status as enum (
  'draft',
  'active',
  'paused',
  'completed',
  'archived'
);

-- What kind of action a sequence step represents. Only 'email' is actually
-- sendable by this schema today; the others exist so sequences can mix in
-- manual/task steps without a future migration changing the column's shape.
create type public.sequence_step_type as enum (
  'email',
  'linkedin_message',
  'call',
  'task'
);

-- Where a contact is in the outreach relationship — independent of any one
-- campaign enrollment (a contact can be 'replied' globally while still
-- showing as 'active' in a second, separate campaign).
create type public.contact_status as enum (
  'new',
  'enriched',
  'contacted',
  'replied',
  'interested',
  'not_interested',
  'bounced',
  'unsubscribed'
);

-- Per-campaign enrollment state for a single contact. Distinct from
-- contact_status: a contact can be globally 'replied' (to a different
-- campaign) while a given enrollment is still 'active'.
create type public.enrollment_status as enum (
  'active',
  'paused',
  'completed',
  'replied',
  'bounced',
  'unsubscribed',
  'failed'
);

-- Sending mailbox provider.
create type public.email_provider as enum ('gmail', 'outlook', 'smtp', 'other');

-- Connection health of a sending mailbox.
create type public.email_account_status as enum (
  'connected',
  'disconnected',
  'error',
  'warming_up'
);
