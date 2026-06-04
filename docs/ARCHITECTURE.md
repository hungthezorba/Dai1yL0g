# Architecture — Dai1yL0g

This document describes the **selected** application architecture for Dai1yL0g after spec intake (2026-06-01). Generic harness rules (layering, parse-first boundaries, observability) still apply.

## Product Surfaces

| Surface | MVP | Notes |
| --- | --- | --- |
| iOS app | Yes | Expo dev build |
| Android app | Yes | Parity with iOS; platform proof required |
| Web | No | — |
| Admin / ops | No | Reports reviewed out-of-band |

## Runtime Stack

See `docs/decisions/0006-dai1yl0g-product-stack.md`.

```text
┌─────────────────────────────────────────┐
│  Expo app (iOS / Android)               │
│  capture · feed · chat · compile · export│
└───────────────┬─────────────────────────┘
                │ HTTPS + Realtime
                v
┌─────────────────────────────────────────┐
│  Supabase (Auth, Postgres, Storage)     │
│  + Edge/worker (signed URLs, FFmpeg)    │
└─────────────────────────────────────────┘
```

## Core Domains

| Domain | Responsibility |
| --- | --- |
| **Identity** | Auth sessions, profiles, devices |
| **Social graph** | Friends, blocks, requests |
| **Capture** | Clip record, local queue, upload |
| **Day** | Timezone boundaries, clip membership |
| **Compile** | Stitch plan, device/server jobs, vlog artifact |
| **Feed** | Friend-visible clips and vlogs |
| **Chat** | Threads, messages, reactions |
| **Notify** | Push scheduling, quiet hours |
| **Safety** | Reports, deletion, retention |

## Client native modules and dev builds

New Expo native dependencies (camera, file system, thumbnails, haptics, FFmpeg, etc.) are linked only when the **development client** is rebuilt. Application code must not assume every native module exists on every installed binary.

- Navigation: **expo-router** only in app code (SDK 56 — no direct `@react-navigation/*` imports). See `docs/decisions/0008-expo-sdk56-router-and-optional-native-modules.md`.
- Optional natives: use `requireOptionalNativeModule` from `expo-modules-core` or guarded dynamic import; degrade UI when null (e.g. timeline placeholder without JPEG thumb).

## Layering (client)

```text
app/ (expo-router screens)
  → features/ (capture, feed, compile, …)
      → application/ (use cases: PostClip, CompileDay, ExportVlog)
          → domain/ (Day, Clip, compile policy — pure TS)
              ← infrastructure/ (supabase client, ffmpeg adapter, file IO)
```

Inner **domain** must not import Supabase, Expo camera, or FFmpeg directly.

## Layering (server)

```text
edge/worker handlers (HTTP)
  → application commands (CreateUploadUrl, RunCompileJob)
      → domain rules
          → infrastructure (storage, postgres, ffmpeg CLI)
```

## Boundary Inputs (parse-first)

- Supabase auth session and JWT claims
- Storage webhook payloads (upload complete)
- Realtime message payloads
- Deep links (`dai1yl0g://…`)
- FFmpeg probe JSON output
- Push notification payloads

## Key Flows

### Post clip

```text
Camera → local file + metadata
  → PostClip command → compress → signed upload → confirm row in clips
  → fan-out feed event → realtime to friends
```

### Compile day

```text
Scheduler / user trigger → CompileDay command
  → device FFmpeg (primary) → verify → upload vlog
  → on failure → enqueue server job → same verify → notify
```

### Export

```text
User action → ExportVlog command → copy verified artifact to gallery / share URI
  → audio_presence_check → success | retry compressed
```

## Security

- All clip/vlog reads enforce friendship (or owner) in **application** layer, not UI-only.
- Signed URLs time-limited (≤15 min).
- No public bucket listing.

## Observability

Server JSON log per request: `timestamp`, `level`, `request_id`, `user_id`, `action`, `duration_ms`, `status_code`, `message`.

Product audit: `Report`, account deletion — separate tables, not mixed into app logs.

## Validation Ladder (when implemented)

```text
validate:quick     — lint, typecheck, unit (domain)
test:integration   — Supabase RLS, upload, compile job API
test:e2e           — Detox/Maestro capture → feed → export
test:platform      — iOS + Android camera + compile smoke
test:release       — long-day stress, export audio check
```

Commands do not exist yet; do not claim they pass until added to `package.json`.

## Dependency Rule

Unchanged from harness defaults — see table in prior generic ARCHITECTURE; domains must not depend on UI frameworks.

## Folder Scaffold Policy

Create `src/` or `app/features/` structure only when **US-001** (foundation story) starts — avoid empty scaffold until implementation.
