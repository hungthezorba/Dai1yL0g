import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AuthColors } from '@/features/auth/design-tokens';
import { AppFonts } from '@/hooks/use-app-fonts';

import { AuthScreenShell } from './auth-screen-shell';

export function GoogleSignInScreen() {
  return (
    <AuthScreenShell
      title="new moment every hour"
      subtitle="vlog it with your close friends.">
      <ThemedText type="small" style={styles.webHint}>
        Google sign-in requires the iOS or Android development build.
      </ThemedText>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  webHint: {
    color: AuthColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: AppFonts.body,
  },
});
