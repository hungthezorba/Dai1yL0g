# Dai1yL0g — Product Overview

## One-Liner

Capture a few seconds at a time; Dai1yL0g stitches your day into one vlog and shares it with friends—no editing required.

## Problem

People want to share **real daily life** with close friends, but:

- Long-form video apps reward production overhead.
- Photo-only apps miss motion and voice.
- Manual vlog editing kills spontaneity.

Setlog proved demand for **micro-clips → daily compilation**, but reviews cite broken Android export, missing audio, and crashes on long days. Dai1yL0g wins on **reliability and Android quality**, not a different concept.

## Product Principles

1. **Camera-first** — App opens to capture; post in under five seconds from cold start (warm path target: two seconds).
2. **Automatic edit** — Users never trim timelines manually for the daily vlog; the system orders clips by capture time.
3. **Friends, not followers** — Mutual friendship required for feed visibility unless explicitly widened later.
4. **Privacy by default** — New content visible only to accepted friends; clear audience controls per account.
5. **Audio is part of the memory** — Capture, stitch, preview, and export must preserve synchronized audio unless user mutes a clip.
6. **Android is not second-class** — Feature parity and performance targets apply equally to iOS and Android.

## Personas

| Persona | Goal | Success signal |
| --- | --- | --- |
| **Daily logger** | Remember and share their day casually | Captures 3+ clips on 4+ days/week |
| **Friend viewer** | See what close friends are up to | Opens feed daily, reacts in chat |
| **Exporter** | Post compiled vlog elsewhere | Successful share/export with audio, no retries |

## Core User Journeys

### J1 — Capture and post (primary loop)

```text
Open app → camera ready → hold/press record (≤10s) → preview (optional) → post to today
→ clip appears on friends' feeds near-real-time
```

### J2 — Watch friends

```text
Feed tab → scroll short clips → tap clip → full-screen + react → optional DM thread
```

### J3 — End of day vlog

```text
Local day window closes (user timezone) → compile job runs → user notified
→ preview daily vlog → share to feed and/or export
```

### J4 — Export / share

```text
Compiled vlog → save to camera roll OR share sheet (Instagram, TikTok, etc.)
→ verify audio + length before leaving app
```

## MVP Scope (v1)

**In scope**

- Google SSO sign-in (Supabase Auth); additional providers post-MVP.
- Mutual friends, private friend feed of clips.
- Quick capture (3–10s configurable cap).
- Per-day clip bucket in user's timezone.
- Automatic daily compilation at day end (user-configurable time, default 23:59).
- On-device FFmpeg stitch for typical days; server fallback when on-device fails.
- In-app chat threads between friends; reactions tied to clips.
- Push reminders ("Time to capture your hour!").
- Export to camera roll + OS share sheet with **audio preserved**.

**Out of scope (v1)**

- Public discover feed, hashtags, or creator monetization.
- Live streaming.
- Manual multi-track video editor.
- Web client.
- Group chats (&gt;2 participants) — pair DMs only at MVP.
- AI captions, filters marketplace, or music licensing library.

## Non-Functional Requirements

| Area | Target |
| --- | --- |
| Camera cold start | ≤2s on mid-tier devices (2024+); ≤5s absolute max |
| Clip upload | Background upload; UI never blocks on network |
| Compile reliability | 99% success for ≤40 clips/day on reference devices |
| Export | ≤60s for 5-minute compiled vlog on reference Android |
| Storage cost | Client-side compression before upload (target ≤2 Mbps H.264) |
| Offline | Queue clips locally; sync when online |

## Related Docs

- `capture.md`, `daily-vlog.md`, `social-feed.md`, `messaging.md`, `export-share.md`, `notifications.md`, `privacy-safety.md`, `accounts.md`, `data-model.md`

## Competitive Notes (Setlog)

| Setlog pain (reviews) | Dai1yL0g contract |
| --- | --- |
| Export without sound | Export pipeline must pass automated audio presence check |
| Long vlogs fail export | Chunked stitch + streaming mux; no hard low clip count |
| Android bugs | Android in CI platform matrix from first compile story |
