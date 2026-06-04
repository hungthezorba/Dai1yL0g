# Quick-Capture Camera

## Purpose

Frictionless in-app camera for **very short** vertical video clips that feed the user's daily bucket and friends' feeds immediately after upload.

## Entry Behavior

- **Default launch surface:** camera (not feed, not settings).
- **Warm resume:** return to camera if last session ended on capture within 30 minutes.
- **Permissions:** camera + microphone requested on first capture attempt with plain-language copy.

## Recording Contract

| Rule | Value |
| --- | --- |
| Min duration | 1 second (discard shorter unless user confirms keep) |
| Max duration | 10 seconds default; product setting 3–10s in v1.1 |
| Orientation | Portrait locked for MVP |
| Resolution | 1080p max; downgrade on low memory devices |
| Frame rate | 30 fps |
| Audio | AAC mono/stereo; **on by default**; mute toggle visible before post |
| Tap pattern | Press-and-hold OR tap-to-start/tap-to-stop (platform HIG) |

## Capture Flow States

```text
idle → recording → review (optional) → uploading → posted
         ↓ cancel
        idle
```

### Review step (optional)

- Skippable in settings ("Post immediately after capture").
- Shows last 3s loop preview with audio meter.
- Actions: Retake, Post, Save draft (local only until posted).

## Performance Requirements

- Time from app foreground to **record-ready**: ≤2s target, ≤5s max on reference devices.
- Shutter feedback &lt;100ms (haptic + visual).
- No full-screen blocking spinners during record.

## Client Storage (pre-upload)

- Each clip written to encrypted app sandbox with metadata: `clipId`, `capturedAt`, `durationMs`, `hasAudio`, `localPath`, `uploadState`.
- Failed uploads retry with exponential backoff; user sees subtle retry badge on day timeline.

## Upload Contract

- Compress with agreed preset (see `data-model.md` — `ClipUploadProfile`).
- Generate thumbnail at 1s mark.
- Upload via signed URL; server returns `clipId` canonical id.
- **Parse-first:** validate server response schema before marking posted.

## Errors (user-visible)

| Code | User message | Recovery |
| --- | --- | --- |
| `CAMERA_UNAVAILABLE` | Camera can't start right now | Open settings / retry |
| `MIC_DENIED` | Dai1yL0g needs mic for sound in clips | Settings link |
| `DISK_FULL` | Not enough space to save clip | Free space guidance |
| `UPLOAD_FAILED` | Couldn't post — saved on device | Tap retry |

## Acceptance Criteria

1. User can record a 5s clip with audible ambient sound and see it on their day timeline within 10s on Wi‑Fi.
2. User can cancel mid-record and return to idle without orphan files.
3. Android and iOS both meet record-ready timing on reference hardware list (defined in initiative I01).

## Out of Scope (v1)

- Front/back simultaneous capture, zoom lenses, beauty filters, green screen.
