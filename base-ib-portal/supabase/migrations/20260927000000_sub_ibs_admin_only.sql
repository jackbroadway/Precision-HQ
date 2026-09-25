-- =============================================================================
-- Base.IB Partner Portal — partner commercial details are admin-only
-- Broker, IB account ID and $/lot rate are no longer visible to sub-IBs,
-- not even their own row. Run after the earlier migrations.
-- =============================================================================

drop policy "sub_ibs: read own or admin" on public.sub_ibs;

create policy "sub_ibs: admin read"
  on public.sub_ibs for select
  to authenticated
  using ((select public.is_admin()));
