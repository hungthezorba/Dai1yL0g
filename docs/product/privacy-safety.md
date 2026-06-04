# Privacy and Safety

## Purpose

Protect users sharing intimate daily life: **audience control**, blocking, reporting, and data retention rules suitable for a young social video app.

## Default Posture

- **Friends-only** visibility for clips and daily vlogs at MVP.
- Account discovery: phone contacts hash upload optional; never expose full phone numbers in UI.
- No public profile URL in v1.

## Friend Graph

- Friend requests require acceptance (mutual).
- Unfriend removes future visibility; does not delete historical DMs (v1: thread archived).

## Block

- Blocker never sees blockee content; blockee cannot message or request friendship.
- Effective immediately server-side.

## Report

| Target | Reasons (MVP) |
| --- | --- |
| Clip / vlog | Harassment, Nudity, Violence, Spam, Other |
| User | Same set |
| Message | Harassment, Spam, Other |

Reports stored with reporter id, target id, timestamp, optional note. Manual review queue out of band (ops tool not in app MVP).

## Data Retention

| Data | Retention |
| --- | --- |
| Clips (server) | Until user deletes or account deletion + 30 day grace |
| Compiled vlogs | Same as clips |
| Messages | 1 year rolling (configurable later) |
| Logs | 30 days operational |

## Account Deletion

- User-initiated delete: revoke sessions, queue media purge, anonymize profile after grace period.
- Export offered before delete when compile exists.

## Minor Safety (policy)

- Terms require 13+ (or local minimum); age gate on signup (birth year).
- No targeted ads in v1.

## Acceptance Criteria

1. Blocked user receives 403 on clip fetch and cannot send DM.
2. Report creates auditable record without exposing reporter to reported user.
3. Privacy policy and ToS linked from settings (URLs TBD).

## Future (document only)

- Close friends list vs all friends audience.
- Clip-level audience override.
