# US-004 Upload + Compression

## Status

implemented

## Lane

normal

## Product Contract

After a clip is saved locally (US-002), compress with **ClipUploadProfile** v1, upload MP4 + JPEG thumbnail to Supabase Storage, and persist a `clips` row. Local index tracks `uploadState`: `local_only` → `uploading` → `posted` | `failed`. Failed uploads retry with exponential backoff; user can tap **Retry** on the day timeline.

## Relevant Product Docs

- `docs/product/capture.md` — upload contract, errors
- `docs/product/data-model.md` — `ClipUploadProfile`, `clips` entity

## Acceptance Criteria

- [x] Clip compresses with H.264 preset (1080p max, 2 Mbps target) when `expo-image-and-video-compressor` is in the dev build; otherwise passes through camera file (stale binary safe).
- [x] Thumbnail generated at ~1s mark when `ExpoVideoThumbnails` is available.
- [x] Upload writes to private `clips` bucket under `{userId}/{clientClipId}.mp4` (+ `.jpg` when present).
- [x] `clips` Postgres row inserted with `upload_state = posted` and `client_clip_id` idempotency.
- [x] Timeline shows uploading / failed / posted badges; tap failed or queued clip to retry.
- [x] Automatic queue processes `local_only` and `failed` clips after capture and on app load.

## Design Notes

- SQL: `supabase/migrations/002_clips_storage.sql` (run after `001_profiles.sql`).
- `src/features/clip/clip-upload-service.ts` — compress → storage → insert (parse-first Zod).
- `src/infrastructure/media/clip-compressor.ts` — dynamic import of compressor; copy fallback per decision 0008.
- `src/features/clip/hooks/use-clip-upload-queue.ts` — serial queue after auth session present.
- Rebuild dev client after adding `expo-image-and-video-compressor` for hardware compression.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | `scripts/test-clip-upload.mjs` |
| Integration | Manual: record clip on Wi‑Fi → badge “Live” within ~10s |
| E2E | — |
| Platform | iOS or Android dev build + Supabase migrations |

## Harness Delta

- Story packet, TEST_MATRIX row, README upload step.

## Evidence

```bash
npm run validate:quick
```

Platform: sign in → record 3–5s clip → timeline shows Posting… then Live; verify row in Supabase `clips` table and objects in Storage `clips` bucket.

## Ship (Git)

Refs: US-004
