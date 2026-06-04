# Dai1yL0g

Capture short video moments through the day; the app stitches them into one **daily vlog** and shares with friends—no manual editing.

**Product contract:** [`docs/product/overview.md`](docs/product/overview.md)  
**Build plan:** [`docs/stories/initiatives/I01-dai1yl0g-mvp.md`](docs/stories/initiatives/I01-dai1yl0g-mvp.md)  
**Harness:** [`docs/HARNESS.md`](docs/HARNESS.md)

---

## Expo development

This is an [Expo](https://expo.dev) SDK 56 project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Quick checks

   ```bash
   npm run validate:quick
   ```

3. **Development build (required for camera — US-001)**

   Camera and microphone use native modules. Expo Go is not the target runtime.

   **iOS prerequisite:** [Expo SDK 56](https://expo.dev/changelog/sdk-56) requires **Xcode 26.4+** on **macOS Tahoe 26.2+**. That is newer than Xcode 16.2 on macOS Sequoia 15.x. A failed local build often shows:

   ```text
   package 'apple' is using Swift tools version 6.2.0 but the installed version is 6.0.0
   ```

   **M1 Pro is supported** for Tahoe and Xcode 26.4 — the usual limit is **macOS version**, not Apple Silicon. Check: `sw_vers`, `xcodebuild -version`, `swift --version`.

   **Recommended if you are on macOS 15.x + Xcode 16.2 (this machine):**

   Build the iOS dev client in the cloud; run JavaScript locally with Metro.

   ```bash
   npx eas-cli build --profile development --platform ios
   ```

   For Simulator, `eas.json` sets `"simulator": true` on the development profile — download the build artifact and install on the iOS Simulator, then:

   ```bash
   npm run start:dev
   ```

   **Android local build** (no Xcode 26.4 needed):

   ```bash
   npx expo run:android
   npm run start:dev
   ```

   **Optional later — local iOS:** upgrade macOS to Tahoe 26.2+, install Xcode 26.4, then `npx expo run:ios`.

   Open the **Capture** tab, grant camera and microphone, and confirm the green **Record-ready** pill (target ≤2s, max ≤5s per `docs/product/capture.md`).

   **After US-002+ native deps** (`expo-file-system`, `expo-haptics`, `expo-video-thumbnails`): rebuild the dev client so native modules are linked — otherwise clip save and thumbnails still work, but haptics/thumbnail previews are skipped until you run `eas build` or `expo run:android` / `expo run:ios` again.

   EAS config: [`eas.json`](eas.json). Native permissions: [`app.json`](app.json) `expo-camera` plugin.

4. Web (UI fallback only)

   ```bash
   npm run web
   ```

   Shows a message to use a dev build on device; web is not proof for US-001.

5. **Auth (US-003 — Supabase phone OTP)**

   ```bash
   cp .env.example .env
   # Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
   ```

   In Supabase: enable **Phone** auth provider; run [`supabase/migrations/001_profiles.sql`](supabase/migrations/001_profiles.sql).

   Restart Metro (`npx expo start -c`). First launch → phone OTP → profile → **Capture** tab.

Routing lives in [`src/app/`](src/app/) (expo-router). Capture: [`src/features/capture/`](src/features/capture/). Auth: [`src/features/auth/`](src/features/auth/).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
