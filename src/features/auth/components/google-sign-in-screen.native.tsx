import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PillButton } from '@/components/playful/pill-button';
import { PlayfulDoodleCluster } from '@/components/playful/playful-doodles';
import { Spacing } from '@/constants/theme';
import { signInWithGoogle } from '@/features/auth/auth-service';
import { AuthColors } from '@/features/auth/design-tokens';
import {
  GOOGLE_SIGNIN_UNAVAILABLE_MESSAGE,
  isGoogleSignInNativeAvailable,
} from '@/features/auth/google-signin-availability';
import { AppFonts } from '@/hooks/use-app-fonts';

import { AuthScreenShell } from './auth-screen-shell';

export function GoogleSignInScreen() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const nativeAvailable = isGoogleSignInNativeAvailable();

  const onGoogleSignIn = async () => {
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
      showDoodles={false}
      title="new moment every hour"
      subtitle="vlog it with your close friends.">
      <View style={styles.doodleWrap}>
        <PlayfulDoodleCluster />
      </View>
      {error ? (
        <ThemedText type="small" style={styles.error}>
          {error}
        </ThemedText>
      ) : null}
      {nativeAvailable ? (
        <PillButton
          label="Continue with Google"
          loading={submitting}
          onPress={() => void onGoogleSignIn()}
        />
      ) : (
        <ThemedText type="small" style={styles.unavailable}>
          {GOOGLE_SIGNIN_UNAVAILABLE_MESSAGE}
        </ThemedText>
      )}
      <ThemedText type="small" style={styles.hint}>
        By continuing you agree to capture only with friends you accept.
      </ThemedText>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  doodleWrap: {
    marginBottom: Spacing.one,
  },
  error: {
    color: AuthColors.error,
    fontFamily: AppFonts.body,
  },
  unavailable: {
    color: AuthColors.textSecondary,
    lineHeight: 22,
    fontFamily: AppFonts.body,
  },
  hint: {
    color: AuthColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: AppFonts.body,
  },
});
