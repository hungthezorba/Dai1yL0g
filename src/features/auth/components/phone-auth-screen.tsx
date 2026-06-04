import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/auth-context';
import { sendPhoneOtp } from '@/features/auth/auth-service';
import { AuthColors } from '@/features/auth/design-tokens';
import { normalizePhoneToE164, phoneE164Schema } from '@/features/auth/schemas';

import { AuthScreenShell } from './auth-screen-shell';

export function PhoneAuthScreen() {
  const router = useRouter();
  const { setPhonePending } = useAuth();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onContinue = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const e164 = phoneE164Schema.parse(normalizePhoneToE164(phone));
      await sendPhoneOtp(e164);
      setPhonePending(e164);
      router.push('/(auth)/verify');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send code.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreenShell
      title="Sign in with your phone"
      subtitle="We’ll text you a one-time code. Friends-only — no public feed.">
      <ThemedText type="small" style={styles.label}>
        Mobile number
      </ThemedText>
      <TextInput
        accessibilityLabel="Phone number"
        autoComplete="tel"
        keyboardType="phone-pad"
        placeholder="+1 415 555 2671"
        placeholderTextColor={AuthColors.textSecondary}
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        editable={!submitting}
      />
      <ThemedText type="small" style={styles.hint}>
        US numbers: enter 10 digits or full +1… E.164 format.
      </ThemedText>
      {error ? (
        <ThemedText type="small" style={styles.error}>
          {error}
        </ThemedText>
      ) : null}
      <Pressable
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={() => void onContinue()}
        disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color={AuthColors.surface} />
        ) : (
          <ThemedText type="smallBold" style={styles.buttonLabel}>
            Send code
          </ThemedText>
        )}
      </Pressable>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  label: {
    color: AuthColors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: AuthColors.border,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 17,
    color: AuthColors.text,
    backgroundColor: AuthColors.background,
  },
  hint: {
    color: AuthColors.textSecondary,
  },
  error: {
    color: AuthColors.error,
  },
  button: {
    backgroundColor: AuthColors.primary,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonLabel: {
    color: '#FFFFFF',
  },
});
