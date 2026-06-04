# US-001 Dev Build + Camera Smoke

## Status

implemented

## Lane

normal

## Product Contract

Development build configured for native camera access. App opens to a live camera preview that reaches **record-ready** (`onCameraReady`) on device, with permission flow and visible readiness timing for platform smoke.

## Relevant Product Docs

- `docs/product/capture.md` — entry behavior, permissions, record-ready timing
- `docs/product/overview.md` — camera-first principle

## Acceptance Criteria

- [x] `expo-camera` installed with config plugin (camera + microphone permissions).
- [x] `expo-dev-client` installed; EAS development profile documented.
- [x] Default route (`index`) shows `CaptureScreen` (not Expo welcome).
- [ ] On device: permission prompt → preview → `onCameraReady` fires; UI shows ready state and elapsed ms. *(human platform smoke)*
- [x] Web shows explicit “use a development build on device” message (no false pass).

## Design Notes

- Feature folder: `src/features/capture/`
- `CameraView` with `mode="video"` for US-002 path.
- Record-ready tracked from screen mount to `onCameraReady`.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | `formatRecordReadyMs` helper |
| Integration | — |
| E2E | — |
| Platform | Manual smoke on iOS/Android dev build; `npm run lint` + `npx tsc --noEmit` |

## Harness Delta

- EAS `eas.json` development profile
- README dev-build instructions

## Evidence

```bash
npm run validate:quick   # lint + tsc + record-ready unit script
```

**Platform smoke (required to close last criterion):**

1. iOS on Mac with Xcode 16.2 / macOS 15.x: use **EAS** (`eas.json` development + `simulator: true`), not `expo run:ios`
2. Android or upgraded Mac (Tahoe + Xcode 26.4): local `expo run:android` / `expo run:ios` OK
3. `npx eas-cli build --profile development --platform ios` when not building iOS locally
3. `npm run start:dev` → open **Capture** tab
4. Grant camera + microphone → confirm green **Record-ready · Nms** pill

**Troubleshooting `expo run:ios`:** Swift 6.2 / Xcode 26.4 required; see README § iOS prerequisite.

Files: `src/features/capture/`, `app.json`, `eas.json`, `README.md` dev-build section.
