# Friend Feed

## Purpose

Private, near-real-time surface where users see **friends' short clips** and **compiled daily vlogs**—not a public algorithmic timeline.

## Feed Types

| Feed | Content | Ordering |
| --- | --- | --- |
| **Friends activity** | New clips + new daily vlogs | Reverse chronological by `publishedAt` |
| **Today (self)** | Own clips + compile status | Capture order |

## Visibility Rules

- Viewer must be **mutual friend** with author.
- Blocked users never appear; block is immediate on server.
- Deleted clips/vlogs removed from feed within 60s (eventual consistency max).

## Clip Card (feed item)

- Autoplay muted in feed; tap for full screen with sound.
- Max loop 3 times in feed unless user interacts.
- Shows: author avatar, display name, relative time, clip duration badge.
- Long-press: react, report, hide (v1.1 hide).

## Daily Vlog Card

- Distinct visual treatment (e.g. "Daily" badge).
- Duration label; tap opens full-screen player.
- If compile still running: "Stitching your day…" on own profile only.

## Real-Time Behavior

- New friend clip appears within **5s p95** when app foregrounded (websocket/realtime subscription).
- Background push optional for "Friend posted" (rate-limited; see `notifications.md`).

## Pagination

- Cursor-based: `beforePublishedAt` + `itemId`.
- Page size 20.

## Empty States

| State | Copy direction |
| --- | --- |
| No friends | Invite friends to see their day |
| Friends, no posts | Be the first — capture something |
| Offline | Showing cached feed; will refresh |

## Acceptance Criteria

1. User A posts clip; User B (friend) sees it in feed without pull-to-refresh within 5s p95.
2. Non-friend cannot access clip via direct API id (403).
3. Feed autoplay respects system reduce-motion and data-saver settings.

## Out of Scope (v1)

- Algorithmic ranking, ads, suggested creators, public explore tab.
