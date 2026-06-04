# Messaging and Reactions

## Purpose

Lightweight social layer: **direct messages** between friends and **reactions** anchored to specific clips or daily vlogs.

## Conversations (MVP)

- **1:1 only** between mutual friends.
- Thread created lazily on first message or reaction.
- Ordering: `sentAt` ascending per thread.

## Message Types

| Type | Payload | Visible in thread |
| --- | --- | --- |
| `text` | UTF-8 text ≤2000 chars | Yes |
| `reaction` | emoji + `targetType` + `targetId` | Yes (rendered as rich attachment) |
| `system` | friend joined, clip deleted | Yes |

## Reactions

- Emoji set: ❤️ 😂 😮 😢 🔥 👏 (extensible server-side).
- One reaction per user per target; changing reaction updates in place.
- Targets: `clip`, `daily_vlog`.

## Clip Context in Chat

- Tapping reaction on feed opens thread with clip thumbnail pinned at top.
- Deep link: `dai1yl0g://chat/{threadId}?clip={clipId}`.

## Real-Time

- Delivery latency **3s p95** for messages when recipient app open.
- Push notification for new message when backgrounded (respect mute).

## Moderation Hooks

- Report message → queues `Report` entity (see `privacy-safety.md`).
- Block user ends thread send/receive immediately.

## Acceptance Criteria

1. User reacts ❤️ on friend's clip; friend sees reaction in feed and thread.
2. Blocked user cannot send messages (403 + local thread archived).
3. Deleted clip shows "Clip unavailable" in historical messages without crash.

## Out of Scope (v1)

- Group chats, voice notes, video messages, E2E encryption (document as future decision).
