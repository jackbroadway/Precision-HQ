-- =============================================================================
-- Base.IB Partner Portal — Phase 1
-- Authentication, roles, sub-IB profiles, row-level security.
--
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- (Or with the Supabase CLI: `supabase db push`.)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Enums
-- ---------------------------------------------------------------------------
create type public.app_role as enum ('admin', 'sub_ib');
create type public.broker as enum ('pu_prime', 'vantage');
create type public.partner_status as enum ('active', 'inactive');

-- ---------------------------------------------------------------------------
-- 2. Tables
-- ---------------------------------------------------------------------------

-- One row per login. Created automatically by a trigger on auth.users.
-- `role` decides what the user can see; it can only be changed by an admin.
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  role        public.app_role not null default 'sub_ib',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Partner details for each sub-IB. One row per sub-IB user.
create table public.sub_ibs (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null unique references public.profiles (id) on delete cascade,
  broker         public.broker not null,
  ib_account_id  text not null check (length(trim(ib_account_id)) > 0),
  rate_per_lot   numeric(10, 2) not null check (rate_per_lot >= 0),
  status         public.partner_status not null default 'active',
  created_by     uuid references public.profiles (id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  -- The same IB account can't be registered twice at the same broker.
  unique (broker, ib_account_id)
);

create index sub_ibs_status_idx on public.sub_ibs (status);

-- ---------------------------------------------------------------------------
-- 3. Helper: is the current user an admin?
--    SECURITY DEFINER so it can read profiles without triggering the
--    profiles RLS policy recursively.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Triggers
-- ---------------------------------------------------------------------------

-- Auto-create a profile whenever an auth user is created.
-- Role is ALWAYS 'sub_ib' here — never read from user metadata, which the
-- user can control. Admins are promoted manually (see README).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, nullif(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep profiles.email in sync if the auth email changes.
create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();

-- updated_at bookkeeping
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger sub_ibs_set_updated_at
  before update on public.sub_ibs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 5. Row-level security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.sub_ibs  enable row level security;

-- Logged-out visitors get nothing at all.
revoke all on public.profiles from anon;
revoke all on public.sub_ibs  from anon;

-- profiles --------------------------------------------------------------
-- Everyone can read their own profile; admins can read all.
create policy "profiles: read own or admin"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

-- Only admins can edit profiles (prevents a sub-IB promoting themselves).
create policy "profiles: admin update"
  on public.profiles for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- No insert/delete policies: rows are created by the trigger above and
-- removed by cascade when the auth user is deleted (service role only).

-- sub_ibs ---------------------------------------------------------------
-- Sub-IBs read only their own row; admins read all.
create policy "sub_ibs: read own or admin"
  on public.sub_ibs for select
  to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

create policy "sub_ibs: admin insert"
  on public.sub_ibs for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "sub_ibs: admin update"
  on public.sub_ibs for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "sub_ibs: admin delete"
  on public.sub_ibs for delete
  to authenticated
  using ((select public.is_admin()));
