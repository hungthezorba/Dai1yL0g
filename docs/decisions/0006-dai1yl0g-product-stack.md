# 0006 Dai1yL0g Product Stack

Date: 2026-06-01

## Status

Accepted

## Context

The repository already contains an **Expo SDK 56** React Native app (`dai1yl0g`). The product spec requires deep camera access, on-device video processing, realtime social features, and large media storage. The user blueprint suggested native Swift/Kotlin, Flutter, Firebase, and S3; we need a stack that balances Setlog-competitive quality with shipping speed and agent-maintainability.

## Decision

### Client (mobile)

- **Expo SDK 56** with **development builds** (not Expo Go for production features).
- **expo-router** for navigation; default route opens **capture** per product principles. SDK 56: no direct `@react-navigation/*` in app code — see `docs/decisions/0008-expo-sdk56-router-and-optional-native-modules.md`.
- **expo-camera** for capture; **expo-av** or native player for preview.
- **ffmpeg-kit-react-native** (or maintained fork) for on-device stitch and export verification.
- **expo-notifications** + FCM/APNs for push.
- TypeScript strict mode; parse-first Zod (or equivalent) at API boundaries.

### Backend (MVP)

- **Supabase** as primary BaaS:
  - Auth: Google SSO via Supabase Auth (see `docs/decisions/0009-google-sso-primary-auth.md`)
  - Database: Postgres (social graph, days, clips metadata, messages)
  - Storage: S3-compatible buckets for clips and vlogs
  - Realtime: feed and chat subscriptions
- **Edge Function** (Deno) or small **Node worker** for:
  - Signed upload URL issuance
  - Server-side FFmpeg compile fallback
  - Webhook-style compile job processor

Rationale: one vendor reduces integration surface for MVP; Postgres fits relational friend graph; Expo community has strong Supabase patterns.

### Media

- Client compresses before upload (`ClipUploadProfile` in `data-model.md`).
- CDN optional post-MVP; direct signed URLs for v1.

### Observability

- Client: structured logs + Sentry (or Expo crash reporting).
- Server: JSON request logs per `docs/ARCHITECTURE.md` observability contract.

## Alternatives Considered

1. **Native Swift + Kotlin** — Best per-platform camera control; rejected for MVP due to two codebases and slower iteration. Revisit if FFmpeg on Expo cannot meet Android export SLA.
2. **Firebase-only** — Good auth/chat; weaker relational modeling for feed ACL and day model. Kept as fallback if team standardizes on Firebase.
3. **Custom Go API + S3** — Maximum control; rejected for MVP operational overhead.
4. **Flutter** — Strong video plugins; rejected because repo already Expo.

## Consequences

Positive:

- Aligns with existing `package.json` and AGENTS.md Expo v56 doc requirement.
- Single TS codebase for iOS/Android.
- Clear path for server compile fallback without rewriting client.

Tradeoffs:

- Native module friction (FFmpeg, dev builds) — must invest early in platform CI.
- Supabase vendor coupling; migration needs decision if scale exceeds BaaS comfort.

## Follow-Up

- Add `docs/product/api-conventions.md` when first API routes are implemented.
- Spike US-001: dev build + camera + FFmpeg load on reference Android device.
- Human confirmation before changing BaaS choice if production Firebase is required.
