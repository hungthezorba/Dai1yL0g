# Data Model (Conceptual)

## Entities

```text
User
  ├── Profile
  ├── Device (push token, platform)
  └── Settings

Friendship (mutual, effectiveAt)
FriendRequest (pending)
Block

Day (userId, localDate, timezone, compileStatus)
  ├── Clip[]
  └── DailyVlog?

Clip
  - id, dayId, userId, capturedAt, durationMs
  - storageKey, thumbnailKey, hasAudio, uploadState
  - publishedAt

DailyVlog
  - id, dayId, userId, storageKey, thumbnailKey
  - durationMs, compileStatus, compilePath (device|server)
  - publishedAt

FeedItem (denormalized view: clip | daily_vlog)

ChatThread (participantIds[2])
Message (threadId, senderId, type, payload, sentAt)
Reaction (userId, targetType, targetId, emoji)

Report
```

## State Machines

### Clip.uploadState

`local_only` → `uploading` → `posted` | `failed`

### Day.compileStatus

`open` → `compiling` → `ready` | `failed` → (retry) → `ready`

### DailyVlog.compileStatus

Mirrors compile job; links to Day.

## ClipUploadProfile (v1)

| Parameter | Value |
| --- | --- |
| Video codec | H.264 |
| Max resolution | 1080p |
| Target bitrate | 2 Mbps |
| Audio | AAC 128 kbps |
| Container | MP4 |

## Indexes (logical)

- Clips by `(userId, dayId, capturedAt)`
- Feed by `(viewerId, publishedAt DESC)` via fan-out or query-on-read for MVP (&lt;500 friends max)
- Messages by `(threadId, sentAt)`

## Idempotency

- Client generates `clientClipId` UUID for upload retries.
- Compile jobs keyed by `(userId, localDate)` — only one active job.

## Deletion Cascades

- Delete clip: remove feed items, invalidate partial compile if day open.
- Delete account: soft-delete user, async purge storage keys.
