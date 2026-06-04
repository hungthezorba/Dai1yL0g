# US-002 Local Clip + Day Bucket UI

## Status

implemented

## Lane

normal

## Product Contract

Record short clips (1–10s), persist to app documents with metadata, show **today's** clips in a horizontal timeline on the capture screen. Upload is US-004.

## Relevant Product Docs

- `docs/product/capture.md`
- `docs/product/data-model.md`

## Acceptance Criteria

- [x] Hold-to-record (max 10s) saves clip to local storage with `local_only` state.
- [x] Clips &lt;1s are discarded without indexing (no orphan in timeline).
- [x] Today strip lists clips sorted by `capturedAt`.
- [x] Mic mute toggle before/during idle; `hasAudio` stored on clip.
- [x] Cancel mid-record does not leave indexed clip (stop + discard temp).

## Design Notes

- UI tokens: `src/features/capture/design-tokens.ts` (ui-ux-pro-max: rose primary, friendly capture).
- `clip-repository.ts` — index.json + mp4 under `documentDirectory/dai1yl0g/clips/`.
- Thumbnails via `requireOptionalNativeModule('ExpoVideoThumbnails')` — see `docs/decisions/0008-expo-sdk56-router-and-optional-native-modules.md`.

## Incidents and Fixes (2026-06-01)

| Symptom | Root cause | Fix |
| --- | --- | --- |
| `expo-router is no longer compatible with react-navigation` | Direct `@react-navigation/native` dependency + import | Removed dep; `useIsFocused` / `useFocusEffect` from `expo-router` |
| `Cannot find native module 'ExpoVideoThumbnails'` | US-001 dev build; `expo-video-thumbnails` throws on JS module load | Optional native probe in `clip-repository.ts`; no `import 'expo-video-thumbnails'` |
| `index.tsx` missing default export / `ErrorBoundary` undefined | Cascade from clip-repository failing before route module loaded | Resolved by optional-native guard |
| Metro still showed old `@react-navigation` in graph | Stale cache | `npx expo start -c` |

**Lesson:** Adding Expo native packages requires a **new dev client build** for full behavior; JS must tolerate older binaries until rebuild (`README.md`).

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | `scripts/test-day-bucket.mjs` |
| Integration | — |
| E2E | — |
| Platform | Manual: record 3–5s clip → appears in Today strip |

## Evidence

```bash
npm run validate:quick
```

- Decision: `docs/decisions/0008-expo-sdk56-router-and-optional-native-modules.md`
- Harness trace: US-002 post-ship fixes (router + optional native modules)

Platform: hold record button on dev build → release → clip in Today strip with time + duration. **Rebuild dev client** for JPEG thumbnails and haptics (US-001 binary insufficient).
