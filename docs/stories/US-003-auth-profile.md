# US-003 Auth + Profile

## Status

implemented

## Lane

high-risk (auth)

## Product Contract

Phone OTP sign-in via Supabase Auth, minimal profile onboarding (`displayName`, `username`, `timezone`, `birthYear`), session persisted across app restarts. Authenticated users with a complete profile land on **Capture**; others see auth/onboarding screens.

## Relevant Product Docs

- `docs/product/accounts.md`
- `docs/product/data-model.md`

## Acceptance Criteria

- [x] Supabase client with secure session storage (`expo-secure-store`).
- [x] Phone OTP start + verify flow (parse-first validation at client boundary).
- [x] Profile setup screen; profile row in `profiles` table (SQL in `supabase/migrations/`).
- [x] Auth gate: no session → phone; session without profile → profile setup; complete → `(app)` capture.
- [x] Session restore on cold start without re-login when refresh token valid.
- [x] `.env.example` documents required Supabase env vars.

## Design Notes

- Feature: `src/features/auth/`
- UI tokens: `src/features/auth/design-tokens.ts` (rose + friendly, aligned with capture).
- Infrastructure: `src/infrastructure/supabase/client.ts`
- Routes: `src/app/(auth)/*`, `src/app/(app)/*`

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | `scripts/test-auth-schemas.mjs` |
| Integration | Manual Supabase project + OTP verify + profile upsert |
| E2E | — |
| Platform | Dev build: cold start → still signed in; new user → OTP → profile → camera |

## Harness Delta

- `supabase/migrations/001_profiles.sql`
- `.env.example`

## Evidence

```bash
npm run validate:quick
```

Integration: configure `.env` from `.env.example`, run SQL migration, enable Phone auth in Supabase dashboard, complete OTP → profile → Capture tab.

## Ship (Git)

When status is **`implemented`**: commit per `docs/COMMIT_CONVENTIONS.md`, push to `origin main`.
