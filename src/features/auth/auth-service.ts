import { getSupabaseClient } from '@/infrastructure/supabase/client';

import { otpCodeSchema, phoneE164Schema } from './schemas';

export async function sendPhoneOtp(phoneE164: string): Promise<void> {
  const phone = phoneE164Schema.parse(phoneE164);
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) {
    throw new Error(error.message);
  }
}

export async function verifyPhoneOtp(phoneE164: string, token: string): Promise<void> {
  const phone = phoneE164Schema.parse(phoneE164);
  const code = otpCodeSchema.parse(token);
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.verifyOtp({
    phone,
    token: code,
    type: 'sms',
  });
  if (error) {
    throw new Error(error.message);
  }
}

export async function signOut(): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}
