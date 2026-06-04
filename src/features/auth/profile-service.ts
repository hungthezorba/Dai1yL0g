import { getSupabaseClient } from '@/infrastructure/supabase/client';

import { mapProfileRow, profileRowSchema, profileSetupSchema, type ProfileRow } from './schemas';
import type { ProfileSetupInput, UserProfile } from './types';

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    return null;
  }

  const row = profileRowSchema.parse(data) satisfies ProfileRow;
  return mapProfileRow(row);
}

export async function upsertProfile(userId: string, input: ProfileSetupInput): Promise<UserProfile> {
  const parsed = profileSetupSchema.parse(input);
  const supabase = getSupabaseClient();

  const payload = {
    id: userId,
    display_name: parsed.displayName,
    username: parsed.username,
    timezone: parsed.timezone,
    birth_year: parsed.birthYear,
  };

  const { data, error } = await supabase.from('profiles').upsert(payload).select('*').single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('That username is already taken.');
    }
    throw new Error(error.message);
  }

  const row = profileRowSchema.parse(data) satisfies ProfileRow;
  return mapProfileRow(row);
}
