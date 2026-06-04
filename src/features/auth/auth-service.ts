import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';

import { getSupabaseClient } from '@/infrastructure/supabase/client';

WebBrowser.maybeCompleteAuthSession();

async function createSessionFromUrl(url: string): Promise<void> {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) {
    throw new Error(errorCode);
  }
  const accessToken = params.access_token;
  const refreshToken = params.refresh_token;
  if (!accessToken) {
    throw new Error('Sign-in did not return a session. Check Supabase redirect URLs.');
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken ?? '',
  });
  if (error) {
    throw new Error(error.message);
  }
}

export async function signInWithGoogle(): Promise<void> {
  const redirectTo = makeRedirectUri({ scheme: 'dai1yl0g' });
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
  if (!data.url) {
    throw new Error('Google sign-in URL was not returned.');
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success') {
    throw new Error('Google sign-in was cancelled.');
  }

  await createSessionFromUrl(result.url);
}

export async function signOut(): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}
