# Accounts and Friends

## Purpose

Identity, profile, and **mutual friend graph** that gates all social surfaces.

## Authentication (MVP)

| Method | Priority |
| --- | --- |
| Phone OTP | Primary |
| Email magic link | Secondary |

- One active session per device token family; refresh token rotation.
- Parse-first validation on all auth responses at client boundary.

## Profile Fields

| Field | Required | Notes |
| --- | --- | --- |
| `displayName` | Yes | 2–32 chars |
| `username` | Yes | Unique, 3–20, `[a-z0-9_]` |
| `avatarUrl` | No | Default generated |
| `timezone` | Yes | IANA; drives day boundaries |
| `compileAt` | No | Default 23:59 local |
| `birthYear` | Yes | Age gate |

## Friend Request Flow

```text
search username / contacts match
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

1. New user completes OTP, sets username, lands on camera.
2. Accepting request makes both users see each other in friend search and feed eligibility.
3. Session refresh works across app restart without re-login for 30 days.

## API Shape (conceptual)

- `POST /auth/otp/start`, `POST /auth/otp/verify`
- `GET /me`, `PATCH /me`
- `POST /friends/request`, `POST /friends/accept`, `DELETE /friends/:id`
- `POST /blocks`, `DELETE /blocks/:id`

Exact transport documented when backend story starts; envelope must be consistent (see future `api-conventions.md`).
