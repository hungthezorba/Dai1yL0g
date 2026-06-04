import { createURL } from 'expo-linking';

/** Deep link Supabase must allow in redirect URLs (e.g. `dai1yl0g://`). */
export function getOAuthRedirectUri(): string {
  return createURL('', { scheme: 'dai1yl0g' });
}

/** Parse tokens from Supabase OAuth callback URL (query + hash). */
export function parseOAuthRedirectUrl(input: string): {
  errorCode: string | null;
  params: Record<string, string>;
} {
  const url = new URL(input, 'https://phony.example');
  const errorCode = url.searchParams.get('errorCode');
  url.searchParams.delete('errorCode');

  const params = Object.fromEntries(url.searchParams.entries());

  if (url.hash) {
    new URLSearchParams(url.hash.replace(/^#/, '')).forEach((value, key) => {
      params[key] = value;
    });
  }

  return { errorCode, params };
}
