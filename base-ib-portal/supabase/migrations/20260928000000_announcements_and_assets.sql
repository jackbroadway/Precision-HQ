-- =============================================================================
-- Base.IB Partner Portal — Announcements + marketing assets
-- Admins post announcements and upload images/captions; every signed-in
-- partner can read them. Run after the earlier migrations.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Announcements
-- ---------------------------------------------------------------------------
create table public.announcements (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (length(trim(title)) between 1 and 200),
  body        text not null check (length(body) <= 5000),
  pinned      boolean not null default false,
  created_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index announcements_feed_idx on public.announcements (pinned desc, created_at desc);

create trigger announcements_set_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Marketing assets: an image, a ready-to-post caption, or both
-- ---------------------------------------------------------------------------
create type public.asset_category as enum ('post', 'story', 'telegram', 'general');

create table public.marketing_assets (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (length(trim(title)) between 1 and 200),
  caption     text check (length(caption) <= 5000),
  image_path  text unique check (image_path ~ '^[0-9a-f-]{36}\.(png|jpg|jpeg|webp|gif)$'),
  category    public.asset_category not null default 'post',
  created_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint marketing_assets_has_content check (caption is not null or image_path is not null)
);

create index marketing_assets_created_idx on public.marketing_assets (created_at desc);

create trigger marketing_assets_set_updated_at
  before update on public.marketing_assets
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row-level security: partners read, admins write
-- ---------------------------------------------------------------------------
alter table public.announcements    enable row level security;
alter table public.marketing_assets enable row level security;
revoke all on public.announcements    from anon;
revoke all on public.marketing_assets from anon;

create policy "announcements: signed-in read"
  on public.announcements for select to authenticated using (true);
create policy "announcements: admin insert"
  on public.announcements for insert to authenticated with check ((select public.is_admin()));
create policy "announcements: admin update"
  on public.announcements for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "announcements: admin delete"
  on public.announcements for delete to authenticated using ((select public.is_admin()));

create policy "assets: signed-in read"
  on public.marketing_assets for select to authenticated using (true);
create policy "assets: admin insert"
  on public.marketing_assets for insert to authenticated with check ((select public.is_admin()));
create policy "assets: admin update"
  on public.marketing_assets for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "assets: admin delete"
  on public.marketing_assets for delete to authenticated using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Image storage. Public bucket: these images are meant to be posted publicly,
-- and file names are random UUIDs. Only admins can upload or delete.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('marketing', 'marketing', true, 10485760,
        array['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

create policy "marketing: admin read"
  on storage.objects for select to authenticated
  using (bucket_id = 'marketing' and (select public.is_admin()));
create policy "marketing: admin upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'marketing' and (select public.is_admin()));
create policy "marketing: admin delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'marketing' and (select public.is_admin()));
