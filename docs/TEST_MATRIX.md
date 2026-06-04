# Test Matrix — Dai1yL0g

Maps product behavior to proof. All rows are **planned** until implementation and evidence exist.

## Status Values

| Status | Meaning |
| --- | --- |
| planned | Accepted contract, not implemented |
| in_progress | Actively being built |
| implemented | Proof exists |
| changed | Contract changed after implementation |
| retired | Removed from product |

## Matrix

| Story | Contract | Unit | Integration | E2E | Platform | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| US-001 | Camera opens record-ready | yes | no | no | yes | implemented | `npm run validate:quick`; manual dev-build smoke |
| US-002 | Clip saved to day bucket locally | yes | no | no | yes | implemented | `npm run validate:quick`; manual record → timeline |
| US-003 | OTP auth + profile | yes | yes | yes | no | planned | none |
| US-004 | Clip upload w/ compression | yes | yes | no | yes | planned | none |
| US-005 | 3-clip stitch w/ audio | yes | no | no | yes | planned | none |
| US-006 | Mutual friends ACL | yes | yes | no | no | planned | none |
| US-007 | Friend feed realtime | no | yes | yes | no | planned | none |
| US-008 | Reaction + DM | yes | yes | yes | no | planned | none |
| US-009 | Scheduled compile + preview | yes | yes | yes | yes | planned | none |
| US-010 | Server compile fallback | yes | yes | no | yes | planned | none |
| US-011 | Export w/ audio gate | no | yes | yes | yes | planned | none |
| US-012 | Quiet-hour reminders | yes | yes | no | yes | planned | none |
| US-013 | 30+ clip day compile | no | yes | no | yes | planned | none |
| US-014 | Block + report + delete | yes | yes | yes | no | planned | none |

## Evidence Rules

- Unit: day boundaries, ordering, ACL helpers, compile state machine.
- Integration: Supabase RLS, signed upload, compile job API, friendship checks.
- E2E: Maestro/Detox flows for capture → feed → export (when harness adds scripts).
- Platform: mandatory for camera, FFmpeg, export, and push stories on **both** iOS and Android reference devices.
