-- ============================================================================
-- 0007_functions_triggers.sql
-- ============================================================================
-- Everything here is "supporting logic": keeping updated_at honest, syncing
-- Supabase Auth into public.users, the org-membership helpers RLS policies
-- depend on, and the data-integrity triggers that close the gap RLS can't
-- (cross-org foreign key references — see the file header note below).

-- ----------------------------------------------------------------------------
-- updated_at maintenance
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at before update on public.users
  for each row execute function public.set_updated_at();
create trigger organizations_set_updated_at before update on public.organizations
  for each row execute function public.set_updated_at();
create trigger companies_set_updated_at before update on public.companies
  for each row execute function public.set_updated_at();
create trigger contacts_set_updated_at before update on public.contacts
  for each row execute function public.set_updated_at();
create trigger sequences_set_updated_at before update on public.sequences
  for each row execute function public.set_updated_at();
create trigger sequence_steps_set_updated_at before update on public.sequence_steps
  for each row execute function public.set_updated_at();
create trigger email_accounts_set_updated_at before update on public.email_accounts
  for each row execute function public.set_updated_at();
create trigger campaigns_set_updated_at before update on public.campaigns
  for each row execute function public.set_updated_at();
create trigger contact_campaigns_set_updated_at before update on public.contact_campaigns
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Supabase Auth integration: auth.users -> public.users
-- ----------------------------------------------------------------------------
-- Fires after Supabase Auth creates a new user (email/password, magic link,
-- OAuth — all of them land here the same way). SECURITY DEFINER is required
-- because this trigger runs as the user performing signup, who has no
-- privileges on public.users yet (RLS forbids self-insert — see 0008); the
-- function's owner privileges are what make the insert possible.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- ----------------------------------------------------------------------------
-- Org-membership helpers (SECURITY DEFINER) — what every RLS policy below
-- ultimately calls.
-- ----------------------------------------------------------------------------
-- Why SECURITY DEFINER: a policy on organization_members that queried
-- organization_members directly to check "am I a member" would recurse —
-- evaluating the policy requires the policy's own result. SECURITY DEFINER
-- functions run with the privileges of their owner (not the caller) and
-- therefore bypass RLS *inside the function body*, breaking the cycle.
-- `set search_path = public` is required hardening: without it, a
-- SECURITY DEFINER function is vulnerable to having its unqualified table
-- references hijacked by a malicious search_path.
create or replace function public.is_org_member(org_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = org_id and m.user_id = auth.uid()
  );
$$;

create or replace function public.is_org_admin(org_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = org_id
      and m.user_id = auth.uid()
      and m.role in ('owner', 'admin')
  );
$$;

create or replace function public.is_org_owner(org_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = org_id
      and m.user_id = auth.uid()
      and m.role = 'owner'
  );
$$;

comment on function public.is_org_member is
  'SECURITY DEFINER: bypasses RLS internally so policies on organization_members can call this without recursing.';

-- ----------------------------------------------------------------------------
-- Auto-membership: the creator of an organization becomes its owner
-- ----------------------------------------------------------------------------
-- Deliberately enforced in the database, not application code: it would be
-- a serious bug for an org to exist with zero owners because a client
-- crashed between "insert organization" and "insert membership". Doing
-- both in one trigger makes that state unreachable.
create or replace function public.handle_new_organization()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.organization_members (organization_id, user_id, role)
  values (new.id, new.created_by, 'owner')
  on conflict (organization_id, user_id) do nothing;
  return new;
end;
$$;

create trigger organizations_create_owner_membership
  after insert on public.organizations
  for each row
  when (new.created_by is not null)
  execute function public.handle_new_organization();

-- ----------------------------------------------------------------------------
-- organization_id denormalization (sequence_steps, contact_campaigns)
-- ----------------------------------------------------------------------------
-- Always derived server-side from the parent row, never accepted from the
-- client — the column exists for fast/simple RLS and indexing, not as
-- client-writable state.
create or replace function public.set_sequence_step_organization_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  select organization_id into new.organization_id
  from public.sequences
  where id = new.sequence_id;

  if new.organization_id is null then
    raise exception 'sequence_steps.sequence_id does not reference an existing sequence';
  end if;

  return new;
end;
$$;

create trigger sequence_steps_set_organization_id
  before insert or update of sequence_id on public.sequence_steps
  for each row execute function public.set_sequence_step_organization_id();

create or replace function public.set_contact_campaign_organization_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  contact_org uuid;
  campaign_org uuid;
begin
  select organization_id into contact_org from public.contacts where id = new.contact_id;
  select organization_id into campaign_org from public.campaigns where id = new.campaign_id;

  if contact_org is null then
    raise exception 'contact_campaigns.contact_id does not reference an existing contact';
  end if;
  if campaign_org is null then
    raise exception 'contact_campaigns.campaign_id does not reference an existing campaign';
  end if;

  -- The cross-org integrity check RLS cannot express on its own: RLS
  -- governs which rows you may touch in the table you're writing to, not
  -- whether a foreign key value you supplied points into a different
  -- tenant's data. Without this, a contact from org A could be enrolled
  -- into a campaign owned by org B.
  if contact_org <> campaign_org then
    raise exception 'contact and campaign belong to different organizations';
  end if;

  new.organization_id = contact_org;
  return new;
end;
$$;

create trigger contact_campaigns_set_organization_id
  before insert or update of contact_id, campaign_id on public.contact_campaigns
  for each row execute function public.set_contact_campaign_organization_id();

-- ----------------------------------------------------------------------------
-- Cross-org reference validation: campaigns.sequence_id / email_account_id
-- ----------------------------------------------------------------------------
-- Same gap as above, same fix: a campaign's sequence and sending mailbox
-- must belong to the same organization as the campaign itself.
create or replace function public.validate_campaign_references()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  sequence_org uuid;
  email_account_org uuid;
begin
  if new.sequence_id is not null then
    select organization_id into sequence_org from public.sequences where id = new.sequence_id;
    if sequence_org is null or sequence_org <> new.organization_id then
      raise exception 'campaigns.sequence_id must belong to the same organization as the campaign';
    end if;
  end if;

  if new.email_account_id is not null then
    select organization_id into email_account_org from public.email_accounts where id = new.email_account_id;
    if email_account_org is null or email_account_org <> new.organization_id then
      raise exception 'campaigns.email_account_id must belong to the same organization as the campaign';
    end if;
  end if;

  return new;
end;
$$;

create trigger campaigns_validate_references
  before insert or update of sequence_id, email_account_id, organization_id on public.campaigns
  for each row execute function public.validate_campaign_references();
