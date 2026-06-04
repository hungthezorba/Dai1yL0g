# 0009 Google SSO as Primary Auth

Date: 2026-06-01

## Status

Accepted (updated 2026-06-01: native Google Sign-In)

## Context

US-003 initially shipped **phone OTP** via Supabase Auth. Product direction changed: sign-in should use **Google SSO** instead of mobile number.

An initial MVP used **Supabase-hosted OAuth** (`signInWithOAuth` + in-app browser). That works without extra native modules but is a worse mobile UX than the platform Google account picker.

## Decision

- **Primary MVP auth:** Google via **`@react-native-google-signin/google-signin`** → Supabase **`signInWithIdToken({ provider: 'google', token })`** ([Supabase React Native guide](https://supabase.com/docs/guides/auth/social-login/auth-google?platform=react-native#google-pre-built)).
- **Configuration:** `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` (Web OAuth client) passed to `GoogleSignin.configure({ webClientId })`; optional `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`; `EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME` for Expo config plugin (`iosUrlScheme` = reversed iOS client ID).
- **Supabase Dashboard:** Google provider enabled; **Client IDs** comma-separated with **Web client ID first**; Web client **secret**; **Skip nonce check** enabled for iOS native flow.
- **Profile onboarding unchanged:** after first Google sign-in, user still sets `username`, `birthYear`, and confirms `displayName` / `timezone` (prefill from Google metadata when available).
- **Session storage:** unchanged — `createSupabaseAuthStorage()` with optional `ExpoSecureStore`.
- **Requires dev client rebuild** after adding the native module (not supported in Expo Go).

## Alternatives Considered

1. **Keep phone OTP** — rejected per product request.
2. **Firebase Auth + Google** — rejected; stack locked to Supabase in 0006.
3. **Supabase `signInWithOAuth` + `expo-web-browser`** — superseded for mobile; kept out of the client path in favor of native sign-in.

## Consequences

Positive:

- Native account picker UX on iOS/Android.
- No in-app browser redirect dance for Google on mobile.

Tradeoffs:

- Google Cloud: Web + iOS + Android OAuth clients and correct Supabase provider configuration.
- EAS / local **rebuild** required when changing native Google config.
- Users without Google need a deferred second provider (Apple Sign In, email) before public launch.

## Follow-Up

- Add Apple Sign In if App Store policy requires it alongside Google.
- Revisit phone OTP only if product requires phone-based friend discovery at scale.
