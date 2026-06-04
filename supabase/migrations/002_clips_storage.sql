-- US-004: clip metadata + private storage bucket

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'clips',
  'clips',
  false,
  52428800,
  array['video/mp4', 'image/jpeg']
)
on conflict (id) do nothing;

create table if not exists public.clips (
  id uuid primary key default gen_random_uuid(),
  client_clip_id uuid not null unique,
  user_id uuid not null references auth.users (id) on delete cascade,
  day_key text not null,
  captured_at timestamptz not null,
  duration_ms integer not null check (duration_ms > 0 and duration_ms <= 60000),
  has_audio boolean not null default true,
  storage_key text,
  thumbnail_key text,
  upload_state text not null default 'uploading'
    check (upload_state in ('uploading', 'posted', 'failed')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clips_user_day_captured_idx
  on public.clips (user_id, day_key, captured_at desc);

alter table public.clips enable row level security;

create policy "clips_select_own"
  on public.clips for select
  using (auth.uid() = user_id);

create policy "clips_insert_own"
  on public.clips for insert
  with check (auth.uid() = user_id);

create policy "clips_update_own"
  on public.clips for update
  using (auth.uid() = user_id);

-- Shared with 001_profiles.sql; defined here so 002 can run standalone.
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists clips_updated_at on public.clips;
create trigger clips_updated_at
  before update on public.clips
  for each row execute function public.handle_updated_at();

-- Storage: users upload only under clips/{userId}/...
create policy "clips_storage_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'clips'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "clips_storage_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'clips'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "clips_storage_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'clips'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
