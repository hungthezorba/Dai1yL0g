import { Platform } from 'react-native';

import { getSupabaseClient } from '@/infrastructure/supabase/client';

import { signInWithGoogleNative, signOutGoogleNative } from './google-signin';

export async function signInWithGoogle(): Promise<void> {
  if (Platform.OS === 'web') {
    throw new Error('Google sign-in requires the iOS or Android development build.');
  }
  await signInWithGoogleNative();
}

export async function signOut(): Promise<void> {
  if (Platform.OS !== 'web') {
    await signOutGoogleNative();
  }
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}
