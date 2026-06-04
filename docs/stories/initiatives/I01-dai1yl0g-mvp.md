# Initiative I01: Dai1yL0g MVP

Status: **in progress** (US-001–US-004 implemented; US-005 next)

## Goal

Ship a friend-only micro-clip social app on **iOS and Android** that reliably compiles and exports daily vlogs—beating Setlog on export audio, long-day stability, and Android quality.

## Product Docs

| Doc | Epic alignment |
| --- | --- |
| `docs/product/overview.md` | All |
| `docs/product/accounts.md` | E01 |
| `docs/product/capture.md` | E02 |
| `docs/product/data-model.md` | E03 |
| `docs/product/daily-vlog.md` | E04 |
| `docs/product/social-feed.md` | E05 |
| `docs/product/messaging.md` | E06 |
| `docs/product/export-share.md` | E07 |
| `docs/product/notifications.md` | E08 |
| `docs/product/privacy-safety.md` | E09 |

## Architecture Decisions

- `docs/decisions/0006-dai1yl0g-product-stack.md`
- `docs/decisions/0007-dai1yl0g-vlog-compilation-strategy.md`

## Recommended Build Order

```text
Phase 0 — Foundation
  US-001 Dev build + camera smoke
  US-002 Local clip record + day bucket UI
  US-003 Auth + profile

Phase 1 — Capture pipeline
  US-004 Upload + compression
  US-005 On-device stitch (2–5 clips, audio test)

Phase 2 — Social
  US-006 Friend graph
  US-007 Feed read + realtime
  US-008 Reactions + 1:1 chat

Phase 3 — Daily vlog product
  US-009 Scheduled compile + preview
  US-010 Server compile fallback
  US-011 Export + share (audio QA gate)

Phase 4 — Habit + hardening
  US-012 Push reminders
  US-013 Long-day stress (30+ clips)
  US-014 Block/report + account delete
```

## Reference Devices (platform proof)

| Platform | Device class |
| --- | --- |
| iOS | iPhone 12 or newer, iOS 17+ |
| Android | Pixel 6a / Samsung A54 class, Android 13+ |

## Validation Shape

| Phase | Proof |
| --- | --- |
| 0–1 | Platform smoke, unit day-boundary tests |
| 2 | Integration auth + feed ACL |
| 3 | E2E capture→compile→export with audio |
| 4 | Platform matrix Android+iOS, release stress |

## Exit Criteria (MVP done)

- [ ] Two test users can friend, post clips, see feed &lt;5s p95.
- [ ] End-of-day compile succeeds for 30-clip synthetic day on Android reference device.
- [ ] Export to camera roll passes audio automated check.
- [ ] Block and report flows work server-side.
- [ ] Capture reminder respects quiet hours.

## Open Questions

- Final BaaS vs self-hosted API (decision 0006 recommends stack; confirm before E01 implementation).
- Contact discovery privacy review before enabling contact upload.

## Not Attempted in This Initiative

- Web app, groups, public feed, manual editor, monetization.
