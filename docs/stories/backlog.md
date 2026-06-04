# Story Backlog

Candidate epics from Dai1yL0g spec intake (2026-06-01). Create story packets under `docs/stories/` when a slice is selected for implementation.

Initiative: `docs/stories/initiatives/I01-dai1yl0g-mvp.md`

## Candidate Epics

| Epic | Description | Status |
| --- | --- | --- |
| E01 | Accounts, onboarding, friend requests | unsliced |
| E02 | Quick-capture camera and clip upload | unsliced |
| E03 | Day bucket, clip timeline, local cache | unsliced |
| E04 | Daily vlog compilation (on-device + fallback) | unsliced |
| E05 | Friend feed and clip consumption | unsliced |
| E06 | Messaging and clip reactions | unsliced |
| E07 | Export and external share | unsliced |
| E08 | Notifications and capture reminders | unsliced |
| E09 | Privacy, safety, and moderation hooks | unsliced |

## First Story Candidates (from initiative)

| ID | Title | Epic | Suggested lane |
| --- | --- | --- | --- |
| US-001 | Dev build + camera smoke | E02 | normal |
| US-002 | Local clip + day bucket UI | E03 | normal |
| US-003 | Auth + profile (Google SSO) | E01 | high-risk (auth) |
| US-004 | Upload + compression | E02 | normal |
| US-005 | On-device stitch proof | E04 | high-risk (media) |
| US-006 | Friend graph | E01 | high-risk (authz) |
| US-007 | Feed + realtime | E05 | normal |
| US-008 | Reactions + 1:1 chat | E06 | normal |
| US-009 | Scheduled compile + preview | E04 | normal |
| US-010 | Server compile fallback | E04 | high-risk (external) |
| US-011 | Export + share audio gate | E07 | high-risk (cross-platform) |
| US-012 | Push reminders | E08 | normal |
| US-013 | Long-day stress test | E04 | normal |
| US-014 | Block, report, delete account | E09 | high-risk (security) |
