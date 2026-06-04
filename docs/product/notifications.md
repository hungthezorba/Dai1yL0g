# Notifications

## Purpose

Habit-building **nudges** that bring users back to capture without spamming—aligned with "Time to capture your hour!" style reminders.

## Channels

| Channel | Use |
| --- | --- |
| Push (APNs/FCM) | Reminders, compile done, friend activity (limited) |
| In-app | Compile progress, upload retry, friend requests |
| Local scheduled | Backup when push denied |

## Notification Types (MVP)

| Type | Default | Copy pattern |
| --- | --- | --- |
| `capture_reminder` | On | "Time to capture your hour!" |
| `compile_complete` | On | "Your daily vlog is ready" |
| `friend_posted` | Off | "{name} shared a moment" |
| `friend_request` | On | "{name} wants to be friends" |
| `message` | On | "{name}: {preview}" |

## Capture Reminder Logic

- User selects cadence: **hourly**, **every 2h**, **custom times** (up to 8 slots), or **off**.
- Quiet hours: no push between user-defined start/end (default 22:00–08:00 local).
- Skip if user already posted in last 45 minutes.
- Max **10** capture reminders per day.

## Deep Links

| Type | Route |
| --- | --- |
| `capture_reminder` | `dai1yl0g://capture` |
| `compile_complete` | `dai1yl0g://day/{dayId}/vlog` |
| `friend_request` | `dai1yl0g://friends/requests` |
| `message` | `dai1yl0g://chat/{threadId}` |

## Permissions

- Request push after first successful post (not on first launch).
- Explain value before system dialog.

## Acceptance Criteria

1. User enables hourly reminders; receives push only outside quiet hours when no recent post.
2. Tapping compile-complete opens vlog preview.
3. Disabling friend_posted stops those pushes within one sync cycle.

## Out of Scope (v1)

- Email notifications, SMS, marketing campaigns.
