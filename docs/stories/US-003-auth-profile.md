# US-003 Auth + Profile

## Status

implemented

## Lane

high-risk (auth)

## Product Contract

**Google SSO** sign-in via Supabase Auth, minimal profile onboarding (`displayName`, `username`, `timezone`, `birthYear`), session persisted across app restarts. Authenticated users with a complete profile land on **Capture**; others see auth/onboarding screens.

## Relevant Product Docs

- `docs/product/accounts.md`
- `docs/product/data-model.md`
- `docs/decisions/0009-google-sso-primary-auth.md`

## Acceptance Criteria

- [x] Supabase client with secure session storage (`expo-secure-store` or in-memory fallback on stale dev builds).
- [x] Native Google sign-in (`@react-native-google-signin/google-signin` + `signInWithIdToken`).
- [x] Profile setup screen; profile row in `profiles` table (SQL in `supabase/migrations/`).
- [x] Auth gate: no session → sign-in; session without profile → profile setup; complete → `(app)` capture.
- [x] Session restore on cold start without re-login when refresh token valid.
- [x] `.env.example` documents Supabase env vars and Google provider setup.

## Design Notes

- Feature: `src/features/auth/`
- Routes: `src/app/(auth)/sign-in`, `profile`; removed phone/OTP screens.
- Prefill `displayName` / `avatarUrl` from Google `user_metadata` when available.

## Change Log

| Date | Change |
| --- | --- |
| 2026-06-01 | Replaced phone OTP with Google SSO per decision 0009. |
| 2026-06-01 | Switched to native `@react-native-google-signin/google-signin` + `signInWithIdToken`. |

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | `scripts/test-auth-schemas.mjs` |
| Integration | Manual: Supabase Google provider + native ID token + profile upsert |
| E2E | — |
| Platform | Dev build: Google sign-in → profile → Capture; cold start session restore |

## Harness Delta

- `supabase/migrations/001_profiles.sql`
- `.env.example`
- `docs/decisions/0009-google-sso-primary-auth.md`

## Evidence

```bash
npm run validate:quick
```

Integration: enable Google in Supabase; configure Web/iOS/Android client IDs; rebuild dev client; sign in → profile → Capture.

## Ship (Git)

When status is **`implemented`**: commit per `docs/COMMIT_CONVENTIONS.md`, push to `origin main`.
