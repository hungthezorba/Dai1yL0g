import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/auth-context';
import { verifyPhoneOtp } from '@/features/auth/auth-service';
import { AuthColors } from '@/features/auth/design-tokens';

import { AuthScreenShell } from './auth-screen-shell';

export function VerifyOtpScreen() {
  const router = useRouter();
  const { phonePending, setPhonePending } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!phonePending) {
    router.replace('/(auth)/phone');
    return null;
  }

  const onVerify = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await verifyPhoneOtp(phonePending, code);
      setPhonePending(null);
      router.replace('/(auth)/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreenShell title="Enter your code" subtitle={`Sent to ${phonePending}`}>
      <TextInput
        accessibilityLabel="Verification code"
        keyboardType="number-pad"
        maxLength={6}
        placeholder="123456"
        placeholderTextColor={AuthColors.textSecondary}
        style={styles.input}
        value={code}
        onChangeText={setCode}
        editable={!submitting}
      />
      {error ? (
        <ThemedText type="small" style={styles.error}>
          {error}
        </ThemedText>
      ) : null}
      <Pressable
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={() => void onVerify()}
        disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <ThemedText type="smallBold" style={styles.buttonLabel}>
            Verify
          </ThemedText>
        )}
      </Pressable>
      <Pressable onPress={() => router.back()} disabled={submitting}>
        <ThemedText type="small" style={styles.link}>
          Use a different number
        </ThemedText>
      </Pressable>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: AuthColors.border,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 24,
    letterSpacing: 8,
    textAlign: 'center',
    color: AuthColors.text,
    backgroundColor: AuthColors.background,
  },
  error: {
    color: AuthColors.error,
  },
  button: {
    backgroundColor: AuthColors.primary,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonLabel: {
    color: '#FFFFFF',
  },
  link: {
    color: AuthColors.cta,
    textAlign: 'center',
    marginTop: Spacing.two,
  },
});
