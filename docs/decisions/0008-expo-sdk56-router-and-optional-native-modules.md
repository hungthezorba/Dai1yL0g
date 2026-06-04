# 0008 Expo SDK 56 Router and Optional Native Modules

Date: 2026-06-01

## Status

Accepted

## Context

During US-002 (local clip + day bucket), the app crashed on a **US-001 dev build** that did not yet include native modules added in US-002 (`expo-video-thumbnails`, `expo-haptics`, `expo-file-system` usage).

Observed failures:

1. **Expo Router SDK 56 check** — direct dependency on `@react-navigation/native` caused a bundler error: app code must not import `@react-navigation/*`; use `expo-router` entry points instead.
2. **`Cannot find native module 'ExpoVideoThumbnails'`** — top-level or dynamic `import('expo-video-thumbnails')` still loads JS that calls `requireNativeModule` synchronously, which throws and can break route loading (cascade: missing default export on `index.tsx`, `NativeTabs` / `ErrorBoundary` errors).
3. **Lazy `import()` is insufficient** — the failure happens at module evaluation, not at `getThumbnailAsync` call time.

## Decision

### Navigation (SDK 56+)

- Do **not** add `@react-navigation/*` as direct app dependencies.
- Import navigation hooks and themes from **`expo-router`** (e.g. `useIsFocused`, `useFocusEffect`) or **`expo-router/react-navigation`** when using lower-level APIs.
- See [SDK 55 → 56 migration](https://docs.expo.dev/router/migrate/sdk-55-to-56/).

### Native modules added after an existing dev client

- Treat **dev client rebuild** as required proof when adding new Expo native modules (`eas build` / `expo run:android` / `expo run:ios` after OS/Xcode constraints are met).
- In application code, **never** top-level-import packages whose entry file calls `requireNativeModule` for features that may be absent on an older binary.
- Prefer **`requireOptionalNativeModule('ModuleName')`** from `expo-modules-core` and call the native API only when non-null (see `src/features/clip/clip-repository.ts` for `ExpoVideoThumbnails`).
- For haptics and similar, use **dynamic import inside try/catch** only when the package does not throw on load; otherwise use the same optional-native pattern.
- **US-003:** `expo-secure-store` must not be top-level-imported; use `createSupabaseAuthStorage()` in `src/infrastructure/supabase/auth-storage.ts` (`requireOptionalNativeModule('ExpoSecureStore')`) with in-memory fallback until rebuild.

### Thumbnails (US-002)

- Keep `expo-video-thumbnails` in `package.json` for autolinking on the **next** native build.
- UI shows a **duration placeholder** when `thumbnailPath` is missing (older dev build or thumbnail generation failed).

## Alternatives Considered

1. **`EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK=1`** — rejected; hides the real contract violation.
2. **Remove `expo-video-thumbnails` entirely until compile/upload stories** — rejected; wanted dependency declared for next EAS build; optional-native guard is enough for JS.
3. **Force every developer to rebuild before merging US-002** — correct long-term but insufficient alone; JS must not crash on stale binaries during local Metro iteration.

## Consequences

Positive:

- App boots on stale dev builds; clip save and timeline work without thumbnails.
- Clear rebuild instruction in README for full native feature set.

Tradeoffs:

- Thumbnails and haptics are silent no-ops until rebuild — easy to mistake for a bug without reading this decision or US-002 evidence.

## Follow-Up

- Add platform proof to US-002 after next EAS iOS / Android dev build (record in story + matrix).
- Consider a small `src/lib/native-module.ts` helper if more optional natives appear in US-003+.
