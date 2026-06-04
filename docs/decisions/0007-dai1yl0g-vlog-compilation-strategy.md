# 0007 Dai1yL0g Vlog Compilation Strategy

Date: 2026-06-01

## Status

Accepted

## Context

Automatic daily vlog stitching is the core value proposition. Setlog users report failures on long days and missing audio on export. Compilation can run on-device (saves cost, works offline) or in the cloud (more CPU, easier debugging). Dai1yL0g must define a **default path**, **fallback**, and **verification** contract.

## Decision

### Primary: on-device FFmpeg

- After day rollover (or manual compile), the mobile app builds an ordered concat list from posted clips.
- Use FFmpeg concat demuxer with **stream copy** when codecs match; re-encode only when probe detects mismatch.
- Normalize audio to AAC 48 kHz on re-encode path.
- Run **post-compile verification** on device:
  - Playable file exists
  - Duration within ±500ms of sum of inputs (cuts only)
  - Audio track present if any input had audio

### Fallback: server compile

Trigger server job when:

- On-device job OOM, timeout (&gt;10 min), or verification fails twice
- Clip count &gt;40 or total source duration &gt;15 min (configurable thresholds)
- User enables "Compile in cloud" setting

Server worker:

- Pulls source objects from storage
- Runs FFmpeg in container (same output spec as `daily-vlog.md`)
- Writes result to `compiled/{userId}/{dayId}.mp4`
- Notifies client via push + realtime

### No silent audio regressions

- Export and share use the **verified compile artifact** only.
- Automated `audio_presence_check` gate in export flow (see `export-share.md`).

### Job idempotency

- Job key: `(userId, localDate)`
- States: `queued` → `processing` → `ready` | `failed`

## Alternatives Considered

1. **Cloud-only compile** — Simpler client; rejected due to upload bandwidth, cost, and offline failure modes.
2. **Client re-encode every clip on stitch** — Maximum compatibility; rejected for battery/time; use copy-first.
3. **Crossfade transitions** — Rejected v1 due to A/V sync risk.

## Consequences

Positive:

- Addresses Setlog Android export complaints with explicit audio verification.
- Scales long days via server without blocking MVP on cloud costs for typical users.

Tradeoffs:

- FFmpeg binary size and Play Store compliance must be validated early.
- Server fallback requires job queue monitoring and storage egress budgeting.

## Follow-Up

- US-005 spike: 3-clip stitch with audio on Android reference device.
- Define server container FFmpeg version pinned to client probe expectations.
