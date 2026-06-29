-- ============================================================================
-- 0008_rls_policies.sql
-- ============================================================================
-- Row ownership model, summarized:
--
--   - SECURITY boundary  = organization membership (is_org_member / admin /
--     owner). Every tenant-scoped table's policies bottom out in one of
--     these three helper functions, never in a row's created_by/owner_id.
--   - BUSINESS ownership = owner_id / created_by columns. Plain data, used
--     for UI filtering ("my contacts"), irrelevant to who CAN see the row.
--   - Delete is admin/owner-gated on every collaborative table. Regular
--     members can create and edit, but cannot permanently destroy shared
--     team data — "remove" in the product should be a status/archive
--     change, with real DELETE reserved for org admins.
--   - email_accounts is the one table where even INSERT/UPDATE is
--     admin/owner-only: it holds sending infrastructure and (encrypted)
--     credentials, not collaborative CRM data.

-- ----------------------------------------------------------------------------
-- users
-- ----------------------------------------------------------------------------
alter table public.users enable row level security;

-- You can see your own profile, and the profile of anyone who shares at
-- least one organization with you (so teammates render by name, not UUID).
create policy users_select_self_or_org_mates
  on public.users for select
  using (
    id = auth.uid()
    or exists (
      select 1
      from public.organization_members mine
      join public.organization_members theirs
        on theirs.organization_id = mine.organization_id
      where mine.user_id = auth.uid()
        and theirs.user_id = public.users.id
    )
  );

create policy users_update_self
  on public.users for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- No INSERT/DELETE policy: rows are created exclusively by
-- handle_new_auth_user() (SECURITY DEFINER, bypasses RLS) and removed via
-- the ON DELETE CASCADE from auth.users — never directly by a client.

-- ----------------------------------------------------------------------------
-- organizations
-- ----------------------------------------------------------------------------
alter table public.organizations enable row level security;

create policy organizations_select_member
  on public.organizations for select
  using (public.is_org_member(id));

-- Any authenticated user may create an organization (self-serve signup);
-- they must name themselves as the creator, and the
-- organizations_create_owner_membership trigger makes them its owner.
create policy organizations_insert_self_as_creator
  on public.organizations for insert
  with check (created_by = auth.uid());

create policy organizations_update_admin
  on public.organizations for update
  using (public.is_org_admin(id))
  with check (public.is_org_admin(id));

create policy organizations_delete_owner
  on public.organizations for delete
  using (public.is_org_owner(id));

-- ----------------------------------------------------------------------------
-- organization_members
-- ----------------------------------------------------------------------------
alter table public.organization_members enable row level security;

create policy organization_members_select_member
  on public.organization_members for select
  using (public.is_org_member(organization_id));

-- Inviting someone new requires admin/owner.
create policy organization_members_insert_admin
  on public.organization_members for insert
  with check (public.is_org_admin(organization_id));

-- Changing a role (promote/demote) is owner-only — admins managing other
-- admins' roles is a privilege-escalation footgun worth avoiding entirely.
create policy organization_members_update_owner
  on public.organization_members for update
  using (public.is_org_owner(organization_id))
  with check (public.is_org_owner(organization_id));

-- Admins/owners can remove anyone; anyone can remove themselves (leave).
create policy organization_members_delete_admin_or_self
  on public.organization_members for delete
  using (public.is_org_admin(organization_id) or user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- companies
-- ----------------------------------------------------------------------------
alter table public.companies enable row level security;

create policy companies_select_member
  on public.companies for select
  using (public.is_org_member(organization_id));
create policy companies_insert_member
  on public.companies for insert
  with check (public.is_org_member(organization_id));
create policy companies_update_member
  on public.companies for update
  using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));
create policy companies_delete_admin
  on public.companies for delete
  using (public.is_org_admin(organization_id));

-- ----------------------------------------------------------------------------
-- contacts
-- ----------------------------------------------------------------------------
alter table public.contacts enable row level security;

create policy contacts_select_member
  on public.contacts for select
  using (public.is_org_member(organization_id));
create policy contacts_insert_member
  on public.contacts for insert
  with check (public.is_org_member(organization_id));
create policy contacts_update_member
  on public.contacts for update
  using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));
create policy contacts_delete_admin
  on public.contacts for delete
  using (public.is_org_admin(organization_id));

-- ----------------------------------------------------------------------------
-- sequences
-- ----------------------------------------------------------------------------
alter table public.sequences enable row level security;

create policy sequences_select_member
  on public.sequences for select
  using (public.is_org_member(organization_id));
create policy sequences_insert_member
  on public.sequences for insert
  with check (public.is_org_member(organization_id));
create policy sequences_update_member
  on public.sequences for update
  using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));
create policy sequences_delete_admin
  on public.sequences for delete
  using (public.is_org_admin(organization_id));

-- ----------------------------------------------------------------------------
-- sequence_steps
-- ----------------------------------------------------------------------------
alter table public.sequence_steps enable row level security;

create policy sequence_steps_select_member
  on public.sequence_steps for select
  using (public.is_org_member(organization_id));
create policy sequence_steps_insert_member
  on public.sequence_steps for insert
  with check (public.is_org_member(organization_id));
create policy sequence_steps_update_member
  on public.sequence_steps for update
  using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));
create policy sequence_steps_delete_admin
  on public.sequence_steps for delete
  using (public.is_org_admin(organization_id));

-- ----------------------------------------------------------------------------
-- email_accounts — locked down to admins/owners for every write
-- ----------------------------------------------------------------------------
alter table public.email_accounts enable row level security;

-- Members can see that a mailbox exists (needed to pick one when building
-- a campaign) — the encrypted token column should still never be selected
-- by client code; expose a column-filtered view if the UI needs to list
-- accounts, rather than relying on clients to "just not select" it.
create policy email_accounts_select_member
  on public.email_accounts for select
  using (public.is_org_member(organization_id));
create policy email_accounts_insert_admin
  on public.email_accounts for insert
  with check (public.is_org_admin(organization_id));
create policy email_accounts_update_admin
  on public.email_accounts for update
  using (public.is_org_admin(organization_id))
  with check (public.is_org_admin(organization_id));
create policy email_accounts_delete_admin
  on public.email_accounts for delete
  using (public.is_org_admin(organization_id));

-- ----------------------------------------------------------------------------
-- campaigns
-- ----------------------------------------------------------------------------
alter table public.campaigns enable row level security;

create policy campaigns_select_member
  on public.campaigns for select
  using (public.is_org_member(organization_id));
create policy campaigns_insert_member
  on public.campaigns for insert
  with check (public.is_org_member(organization_id));
create policy campaigns_update_member
  on public.campaigns for update
  using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));
create policy campaigns_delete_admin
  on public.campaigns for delete
  using (public.is_org_admin(organization_id));

-- ----------------------------------------------------------------------------
-- contact_campaigns
-- ----------------------------------------------------------------------------
alter table public.contact_campaigns enable row level security;

create policy contact_campaigns_select_member
  on public.contact_campaigns for select
  using (public.is_org_member(organization_id));
create policy contact_campaigns_insert_member
  on public.contact_campaigns for insert
  with check (public.is_org_member(organization_id));
create policy contact_campaigns_update_member
  on public.contact_campaigns for update
  using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));
create policy contact_campaigns_delete_admin
  on public.contact_campaigns for delete
  using (public.is_org_admin(organization_id));
