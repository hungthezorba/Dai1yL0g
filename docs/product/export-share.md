# Export and Share

## Purpose

Let users **save compiled daily vlogs** to the device and **share to external apps** with reliable audio and length—directly addressing Setlog's weakest review themes.

## Supported Actions

| Action | Input | Output |
| --- | --- | --- |
| Save to camera roll | `daily_vlog` id | MP4 in Photos/Gallery |
| Share sheet | `daily_vlog` id | OS share intent with file URI |
| Copy link (future) | N/A v1 | — |

## Preconditions

- Compile status must be `ready`.
- User must own the vlog.
- Export uses **same asset** as streaming preview (no re-encode unless required for compatibility).

## Audio Guarantee (contract)

Before marking export success:

1. Output file has audio track (`ffprobe` or platform equivalent).
2. If any source clip had `hasAudio=true`, integrated loudness check is not silent.
3. User hears preview with sound once per export session (can disable in settings).

## Length and Size

- No artificial low clip-count limit.
- Warn at 15 min compiled duration; allow up to 20 min hard cap.
- If file &gt;500 MB, offer "Export compressed (720p)" secondary action.

## Android-Specific Requirements

- Use scoped storage APIs; no legacy WRITE_EXTERNAL_STORAGE dependency.
- Test share targets: Instagram, TikTok, Messages on reference devices.
- Progress notification for exports &gt;30s.

## Error Handling

| Failure | User experience |
| --- | --- |
| Transcode for share failed | Retry + "Save original" if compatible |
| Permission denied (photos) | Settings deep link |
| Target app rejected file | Show codec hint + compressed retry |

## Acceptance Criteria

1. 10-clip / ~90s vlog exports to camera roll with audible audio on iOS and Android reference devices.
2. 35-clip day (~12 min) exports without app crash on reference Android.
3. Share to Instagram Reels preserves audio (manual QA checklist in initiative I01).

## Metrics

- `export_success_rate`, `export_duration_ms`, `export_audio_check_failed`.
