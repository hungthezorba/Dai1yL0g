# Daily Vlog Compilation

## Purpose

The core product promise: at end of day (user timezone), all clips captured that calendar day are **automatically merged** into one continuous **daily vlog** MP4 with correct order, transitions, and **intact audio**.

## Day Model

- A **Day** is bounded by the user's configured timezone and **day rollover time** (default 23:59 local).
- Clips belong to exactly one Day via `capturedAt` in that window.
- Clips posted after rollover attach to the **next** Day.

## Clip Ordering

1. Primary sort: `capturedAt` ascending.
2. Tie-break: `clipId` lexicographic (stable).
3. User cannot reorder in v1 (reduces scope; future story if demanded).

## Compilation Triggers

| Trigger | When |
| --- | --- |
| Scheduled | User's `compileAt` (default 23:59) |
| Manual | User taps "Compile now" on today's timeline (once per hour max) |
| Catch-up | App foreground after missed compile job failed |

## Pipeline (logical)

```text
collect clips for Day
  → validate (count, corrupt files, duration sum)
  → build stitch plan (ordered inputs, audio maps)
  → execute compile (on-device FFmpeg primary)
  → verify output (duration, audio track present, playable)
  → upload compiled asset + thumbnail
  → notify user + publish to optional friend preview
```

## On-Device vs Server

See `docs/decisions/0007-dai1yl0g-vlog-compilation-strategy.md`.

| Path | Use when |
| --- | --- |
| On-device | Default; ≤40 clips and device passes capability probe |
| Server fallback | On-device OOM/timeout, corrupt output, or user setting "Always compile in cloud" |

## Transitions (v1)

- Hard cut between clips (no crossfade) to reduce A/V sync risk.
- Optional 0.3s black frame between clips if audio discontinuity detected (feature flag).

## Audio Rules

- Each clip's audio track included unless user muted that clip at capture.
- Output: single AAC track; sample rate normalized to 48 kHz during mux.
- **Automated check:** RMS level &gt; silence threshold for at least one segment when any source clip had `hasAudio=true`.

## Output Spec

| Field | Value |
| --- | --- |
| Container | MP4 |
| Video | H.264, max 1080p, 30fps |
| Audio | AAC-LC |
| Max output duration | 20 minutes (soft warn at 15; hard cap prevents runaway) |

## Progress UX

- Background compile shows persistent notification with % when possible.
- Failure shows actionable error: Retry on device, Retry in cloud, Contact support (logs attached).

## Friend Visibility

- Compiled vlog inherits **day-level** visibility: same as clips (friends only MVP).
- User can hide compiled vlog from feed while keeping clips visible (v1.1).

## Acceptance Criteria

1. Three clips (3s, 5s, 7s) with distinct audible cues compile to 15s output with three cues audible in order.
2. 30-clip day compiles on reference Android without crash.
3. Failed on-device compile automatically queues server job and completes within 15 minutes on Wi‑Fi.
4. User can preview compiled vlog before it appears on friends' feeds (setting default: on).

## Metrics

- `compile_success_rate`, `compile_duration_ms`, `compile_path` (device|server), `clips_in_day`.
