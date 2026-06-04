import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

import { getSupabaseClient } from '@/infrastructure/supabase/client';

import { formatGoogleSignInError } from './google-signin-errors';

const IOS_BUNDLE_ID = 'com.dai1yl0g.app';

function readGoogleEnv(): { webClientId: string; iosClientId: string | undefined } {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() ?? '';
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim() || undefined;
  return { webClientId, iosClientId };
}

function assertGoogleEnvForPlatform(): { webClientId: string; iosClientId?: string } {
  const { webClientId, iosClientId } = readGoogleEnv();
  if (!webClientId) {
    throw new Error(
      'Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in .env (Google Cloud Web OAuth client ID).',
    );
  }
  if (Platform.OS === 'ios' && !iosClientId) {
    throw new Error(
      `Set EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID in .env (Google Cloud → OAuth client → iOS, bundle ID ${IOS_BUNDLE_ID}).`,
    );
  }
  return { webClientId, iosClientId };
}

export function configureGoogleSignInImpl(): void {
  const { webClientId, iosClientId } = readGoogleEnv();
  if (!webClientId) {
    return;
  }
  if (Platform.OS === 'ios' && !iosClientId) {
    return;
  }
  GoogleSignin.configure({
    webClientId,
    ...(iosClientId ? { iosClientId } : {}),
  });
}

export async function signInWithGoogleNativeImpl(): Promise<void> {
  const { webClientId, iosClientId } = assertGoogleEnvForPlatform();
  GoogleSignin.configure({
    webClientId,
    ...(iosClientId ? { iosClientId } : {}),
  });

  if (Platform.OS === 'android') {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  }

  try {
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) {
      throw new Error('Google sign-in was cancelled.');
    }
    const idToken = response.data.idToken;
    if (!idToken) {
      throw new Error(
        'Google did not return an ID token. Use your Web OAuth client ID as EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.',
      );
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });
    if (error) {
      throw new Error(formatGoogleSignInError(error));
    }
  } catch (err) {
    if (isErrorWithCode(err)) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Google sign-in was cancelled.');
      }
      if (err.code === statusCodes.IN_PROGRESS) {
        throw new Error('Google sign-in is already in progress.');
      }
      if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Google Play Services are not available on this device.');
      }
    }
    throw new Error(formatGoogleSignInError(err));
  }
}

export async function signOutGoogleNativeImpl(): Promise<void> {
  try {
    await GoogleSignin.signOut();
  } catch {
    // User may not have signed in with Google on this device.
  }
}
