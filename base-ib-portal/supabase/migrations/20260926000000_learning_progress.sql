-- =============================================================================
-- Base.IB Partner Portal — Learning progress
-- Records which playbook modules each partner has completed.
-- Run after 20260925000000_phase1_auth_roles.sql.
-- =============================================================================

create table public.learning_progress (
  user_id       uuid not null references public.profiles (id) on delete cascade,
  playbook      text not null check (playbook ~ '^[a-z0-9-]{1,64}$'),
  module        text not null check (module ~ '^[a-z0-9-]{1,120}$'),
  completed_at  timestamptz not null default now(),
  primary key (user_id, playbook, module)
);

alter table public.learning_progress enable row level security;
revoke all on public.learning_progress from anon;

-- Partners see their own progress; admins see everyone's (for the partner page).
create policy "progress: read own or admin"
  on public.learning_progress for select
  to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

-- Partners can only mark / unmark modules for themselves.
create policy "progress: insert own"
  on public.learning_progress for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "progress: delete own"
  on public.learning_progress for delete
  to authenticated
  using (user_id = (select auth.uid()));
