# Accounts and Friends

## Purpose

Identity, profile, and **mutual friend graph** that gates all social surfaces.

## Authentication (MVP)

| Method | Priority |
| --- | --- |
| Google SSO (OAuth) | Primary |
| Apple Sign In | Post-MVP (App Store) |
| Phone OTP | Deferred |
| Email magic link | Deferred |

- Supabase Auth hosts the Google OAuth flow; client completes redirect via app scheme `dai1yl0g://`.
- One active session per device token family; refresh token rotation.
- Parse-first validation on all auth responses and profile rows at the client boundary.

## Profile Fields

| Field | Required | Notes |
| --- | --- | --- |
| `displayName` | Yes | 2–32 chars; may prefill from Google `full_name` |
| `username` | Yes | Unique, 3–20, `[a-z0-9_]` |
| `avatarUrl` | No | Prefill from Google `picture` when present |
| `timezone` | Yes | IANA; device default via `Intl` |
| `compileAt` | No | Default 23:59 local |
| `birthYear` | Yes | Age gate (13+) |

## Friend Request Flow

```text
search username / contacts match (contacts deferred)
  → send request (pending)
  → accept | decline
  → mutual friendship created
```

- Pending requests expire after 30 days.
- Max outgoing pending: 50.

## Settings (account)

- Notification preferences (`notifications.md`).
- Capture max duration (3–10s).
- Quiet hours.
- Post-immediately vs review-after-capture.

## Acceptance Criteria

1. New user completes Google sign-in, sets username (+ birth year), lands on camera.
2. Accepting request makes both users see each other in friend search and feed eligibility.
3. Session refresh works across app restart without re-login for 30 days.

## API Shape (conceptual)

- `POST /auth/oauth/google` (client: native Google ID token → Supabase `signInWithIdToken`)
- `GET /me`, `PATCH /me` (profiles table)
- `POST /friends/request`, `POST /friends/accept`, `DELETE /friends/:id`
- `POST /blocks`, `DELETE /blocks/:id`

Exact transport documented when backend story starts; envelope must be consistent (see future `api-conventions.md`).
