import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PlayfulCard } from '@/components/playful/playful-card';
import { Spacing } from '@/constants/theme';
import { PlayfulColors } from '@/design/tokens';
import { AuthColors } from '@/features/auth/design-tokens';
import { AppFonts } from '@/hooks/use-app-fonts';

import { AuthScreenShell } from './auth-screen-shell';

export function AuthSetupScreen() {
  return (
    <AuthScreenShell
      title="Connect Supabase & Google"
      subtitle="Native Google sign-in needs Supabase and Google Cloud OAuth clients."
      showDoodles={false}>
      <View style={styles.body}>
        <PlayfulCard style={styles.stepCard}>
          <ThemedText type="small" style={styles.text}>
            1. Copy <ThemedText type="code">.env.example</ThemedText> to{' '}
            <ThemedText type="code">.env</ThemedText>
          </ThemedText>
        </PlayfulCard>
        <PlayfulCard style={styles.stepCard}>
          <ThemedText type="small" style={styles.text}>
            2. Google Cloud → OAuth clients: Web, iOS, Android
          </ThemedText>
        </PlayfulCard>
        <PlayfulCard style={styles.stepCard}>
          <ThemedText type="small" style={styles.text}>
            3. Supabase → Google provider + <ThemedText type="code">Skip nonce check</ThemedText>
          </ThemedText>
        </PlayfulCard>
        <PlayfulCard style={styles.stepCard}>
          <ThemedText type="small" style={styles.text}>
            4. Run SQL: <ThemedText type="code">001_profiles.sql</ThemedText> +{' '}
            <ThemedText type="code">002_clips_storage.sql</ThemedText>
          </ThemedText>
        </PlayfulCard>
        <PlayfulCard style={styles.stepCard}>
          <ThemedText type="small" style={styles.text}>
            5. Rebuild dev client — not Expo Go
          </ThemedText>
        </PlayfulCard>
      </View>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.two,
  },
  stepCard: {
    padding: Spacing.three,
    backgroundColor: PlayfulColors.surface,
  },
  text: {
    color: AuthColors.text,
    lineHeight: 22,
    fontFamily: AppFonts.body,
  },
});
