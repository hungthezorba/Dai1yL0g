import type { Session } from '@supabase/supabase-js';

export type GoogleProfilePrefill = {
  displayName: string;
  avatarUrl: string | null;
};

export function getGoogleProfilePrefill(session: Session | null): GoogleProfilePrefill {
  if (!session) {
    return { displayName: '', avatarUrl: null };
  }

  const meta = session.user.user_metadata as Record<string, unknown>;
  const displayName =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    '';

  const avatarUrl =
    (typeof meta.avatar_url === 'string' && meta.avatar_url) ||
    (typeof meta.picture === 'string' && meta.picture) ||
    null;

  return { displayName, avatarUrl };
}
