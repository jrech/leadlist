-- ============================================================================
-- 0006_indexes.sql
-- ============================================================================
-- Unique indexes that double as dedup constraints are declared inline with
-- their tables (0003-0005). Everything here is a plain lookup/filter index.
--
-- Rule of thumb applied throughout: every column an RLS policy filters on,
-- and every foreign key that gets looked up "from the child side" in normal
-- application queries, gets an index. Composite PKs already index their
-- leading column for free (e.g. organization_members.organization_id) —
-- only the columns NOT covered by an existing index/PK are added here.

-- organization_members: the PK (organization_id, user_id) covers lookups by
-- organization_id for free, but "which orgs does this user belong to" —
-- exactly what every is_org_member() call needs — filters by user_id alone.
create index organization_members_user_id_idx
  on public.organization_members (user_id);

-- companies
create index companies_organization_id_idx on public.companies (organization_id);

-- contacts
create index contacts_organization_id_idx on public.contacts (organization_id);
create index contacts_company_id_idx on public.contacts (company_id) where company_id is not null;
create index contacts_owner_id_idx on public.contacts (owner_id) where owner_id is not null;
create index contacts_status_idx on public.contacts (organization_id, status);

-- sequences
create index sequences_organization_id_idx on public.sequences (organization_id);

-- sequence_steps (sequence_id is covered by its own unique constraint with
-- step_number, but that composite index doesn't help a plain
-- "all steps for this sequence" scan as well as a dedicated index on the
-- leading column alone — Postgres can use the composite for this too, so
-- this is a deliberate explicit decision: skip a redundant index here and
-- rely on sequence_steps_sequence_step_number_key's leading column.)
create index sequence_steps_organization_id_idx on public.sequence_steps (organization_id);

-- email_accounts
create index email_accounts_organization_id_idx on public.email_accounts (organization_id);
create index email_accounts_status_idx on public.email_accounts (organization_id, status);

-- campaigns
create index campaigns_organization_id_idx on public.campaigns (organization_id);
create index campaigns_sequence_id_idx on public.campaigns (sequence_id) where sequence_id is not null;
create index campaigns_email_account_id_idx on public.campaigns (email_account_id) where email_account_id is not null;
create index campaigns_status_idx on public.campaigns (organization_id, status);

-- contact_campaigns — the hot table.
create index contact_campaigns_organization_id_idx on public.contact_campaigns (organization_id);
create index contact_campaigns_contact_id_idx on public.contact_campaigns (contact_id);
create index contact_campaigns_campaign_id_idx on public.contact_campaigns (campaign_id);
create index contact_campaigns_current_step_id_idx
  on public.contact_campaigns (current_step_id)
  where current_step_id is not null;

-- THE critical index in this schema: a sending worker's core query is
-- "find active enrollments whose next action is due", repeated every
-- polling cycle, forever. A partial index — only rows that could possibly
-- match — keeps it small and fast even with millions of completed/bounced
-- historical enrollments sitting in the same table.
create index contact_campaigns_due_idx
  on public.contact_campaigns (next_action_at)
  where status = 'active';
