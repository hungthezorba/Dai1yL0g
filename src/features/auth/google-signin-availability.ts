import { requireOptionalNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';

export const GOOGLE_SIGNIN_UNAVAILABLE_MESSAGE =
  'Google Sign-In needs a new development build with the Google Sign-In native module. Run `eas build --profile development` or `npx expo run:ios`, install that build, then restart Metro. Expo Go and older dev clients do not include this module.';

export function isGoogleSignInNativeAvailable(): boolean {
  if (Platform.OS === 'web') {
    return false;
  }
  return requireOptionalNativeModule('RNGoogleSignin') != null;
}
