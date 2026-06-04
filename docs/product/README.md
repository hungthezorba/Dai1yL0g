# Product Docs — Dai1yL0g

Living product contract for Dai1yL0g (Setlog-style daily micro-vlog app). Derived from spec intake `docs/spec-intake/2026-06-01-dai1yl0g.md`.

| Doc | Domain |
| --- | --- |
| `overview.md` | Vision, MVP scope, principles |
| `accounts.md` | Auth, profile, friends |
| `capture.md` | Quick-capture camera |
| `daily-vlog.md` | Auto stitch / compile |
| `social-feed.md` | Friend feed |
| `messaging.md` | DM + reactions |
| `export-share.md` | Camera roll + share |
| `notifications.md` | Reminders + push |
| `privacy-safety.md` | Block, report, retention |
| `data-model.md` | Entities and states |

When behavior changes: update the affected doc, story packet, test matrix row, and decision record if architecture or scope shifts.

## Update Rule

When behavior changes:

1. Update the affected product doc.
2. Update or create the story packet.
3. Update durable proof status with `scripts/bin/harness-cli story add` or
   `scripts/bin/harness-cli story update`.
4. Record a decision if the change affects architecture, scope, risk, or a
   previously settled product rule.
