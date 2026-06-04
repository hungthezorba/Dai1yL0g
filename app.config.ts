import type { ConfigContext, ExpoConfig } from 'expo/config';

import appJson from './app.json';

const GOOGLE_SIGNIN_PLUGIN = '@react-native-google-signin/google-signin';

/** Reversed iOS client ID used as CFBundleURLSchemes entry (Google Sign-In). */
export function deriveGoogleIosUrlScheme(iosClientId?: string): string | undefined {
  const explicit = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME?.trim();
  if (explicit) {
    return explicit;
  }
  const clientId = iosClientId?.trim() ?? process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();
  if (!clientId) {
    return undefined;
  }
  const suffix = '.apps.googleusercontent.com';
  if (!clientId.endsWith(suffix)) {
    return undefined;
  }
  const idPart = clientId.slice(0, -suffix.length);
  return `com.googleusercontent.apps.${idPart}`;
}

function withGoogleSignInPlugin(plugins: ExpoConfig['plugins']): ExpoConfig['plugins'] {
  const iosUrlScheme = deriveGoogleIosUrlScheme();
  const filtered = (plugins ?? []).filter((entry) => {
    if (entry === GOOGLE_SIGNIN_PLUGIN) {
      return false;
    }
    if (Array.isArray(entry) && entry[0] === GOOGLE_SIGNIN_PLUGIN) {
      return false;
    }
    return true;
  });

  if (iosUrlScheme) {
    return [...filtered, [GOOGLE_SIGNIN_PLUGIN, { iosUrlScheme }]];
  }

  return [...filtered, GOOGLE_SIGNIN_PLUGIN];
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const expo = appJson.expo as ExpoConfig;
  return {
    ...config,
    ...expo,
    plugins: withGoogleSignInPlugin(expo.plugins),
  };
};
