-- Fix storage RLS path check (foldername can be empty on some Postgres builds).
-- Safe to re-run.

drop policy if exists "clips_storage_insert_own" on storage.objects;
drop policy if exists "clips_storage_select_own" on storage.objects;
drop policy if exists "clips_storage_update_own" on storage.objects;

create policy "clips_storage_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'clips'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "clips_storage_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'clips'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "clips_storage_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'clips'
    and split_part(name, '/', 1) = auth.uid()::text
  )
  with check (
    bucket_id = 'clips'
    and split_part(name, '/', 1) = auth.uid()::text
  );
