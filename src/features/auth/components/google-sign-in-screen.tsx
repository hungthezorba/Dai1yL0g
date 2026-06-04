import { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { signInWithGoogle } from '@/features/auth/auth-service';
import { AuthColors } from '@/features/auth/design-tokens';

import { AuthScreenShell } from './auth-screen-shell';

export function GoogleSignInScreen() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onGoogleSignIn = async () => {
    if (Platform.OS === 'web') {
      setError('Google sign-in requires the iOS or Android development build.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in with Google.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreenShell
      title="Sign in to Dai1yL0g"
      subtitle="Use Google to capture and share daily moments with close friends.">
      {error ? (
        <ThemedText type="small" style={styles.error}>
          {error}
        </ThemedText>
      ) : null}
      <Pressable
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={() => void onGoogleSignIn()}
        disabled={submitting}
        accessibilityRole="button"
        accessibilityLabel="Continue with Google">
        {submitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <ThemedText type="smallBold" style={styles.buttonLabel}>
            Continue with Google
          </ThemedText>
        )}
      </Pressable>
      <ThemedText type="small" style={styles.hint}>
        By continuing you agree to capture only with friends you accept.
      </ThemedText>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  error: {
    color: AuthColors.error,
  },
  button: {
    backgroundColor: AuthColors.cta,
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
  hint: {
    color: AuthColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
