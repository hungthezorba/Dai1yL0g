const NONCE_MISMATCH_PATTERNS = [
  'passed nonce and nonce in id_token',
  'nonces mismatch',
] as const;

export const SUPABASE_GOOGLE_SKIP_NONCE_HINT =
  'In Supabase Dashboard → Authentication → Providers → Google, turn on "Skip nonce check" (required for native iOS Google Sign-In with this library), then try again.';

export function isGoogleNonceMismatchError(message: string): boolean {
  const lower = message.toLowerCase();
  return NONCE_MISMATCH_PATTERNS.some((part) => lower.includes(part));
}

export function formatGoogleSignInError(err: unknown): string {
  const message = err instanceof Error ? err.message : 'Google sign-in failed.';
  if (isGoogleNonceMismatchError(message)) {
    return `${message} ${SUPABASE_GOOGLE_SKIP_NONCE_HINT}`;
  }
  return message;
}
