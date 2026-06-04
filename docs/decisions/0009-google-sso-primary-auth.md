# 0009 Google SSO as Primary Auth

Date: 2026-06-01

## Status

Accepted

## Context

US-003 initially shipped **phone OTP** via Supabase Auth. Product direction changed: sign-in should use **Google SSO** (OAuth) instead of mobile number, reducing SMS cost, onboarding friction, and provider setup for MVP.

Phone OTP and email magic link remain valid **future** options per `docs/product/accounts.md` (deferred).

## Decision

- **Primary MVP auth:** Google OAuth through **Supabase Auth** (`signInWithOAuth({ provider: 'google' })`).
- **Client flow:** `expo-web-browser` + `expo-auth-session` redirect URI (`dai1yl0g://` scheme); session established via `setSession` from callback URL.
- **Profile onboarding unchanged:** after first Google sign-in, user still sets `username`, `birthYear`, and confirms `displayName` / `timezone` (prefill from Google metadata when available).
- **Session storage:** unchanged — `createSupabaseAuthStorage()` with optional `ExpoSecureStore`.

## Alternatives Considered

1. **Keep phone OTP** — rejected per product request.
2. **Firebase Auth + Google** — rejected; stack locked to Supabase in 0006.
3. **Native `@react-native-google-signin/google-signin`** — rejected for MVP; Supabase-hosted OAuth is simpler and cross-platform with one config surface.

## Consequences

Positive:

- Faster onboarding for users with Google accounts.
- No SMS / Twilio configuration for MVP.

Tradeoffs:

- Requires Google Cloud OAuth client + Supabase Google provider configuration.
- Users without Google need a deferred second provider (Apple Sign In, email) before public launch.

## Follow-Up

- Add Apple Sign In if App Store policy requires it alongside Google.
- Revisit phone OTP only if product requires phone-based friend discovery at scale.
