import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { AuthColors } from '@/features/auth/design-tokens';

import { AuthScreenShell } from './auth-screen-shell';

export function AuthSetupScreen() {
  return (
    <AuthScreenShell
      title="Connect Supabase"
      subtitle="Google sign-in needs a Supabase project and OAuth configuration.">
      <View style={styles.body}>
        <ThemedText type="small" style={styles.text}>
          1. Copy <ThemedText type="code">.env.example</ThemedText> to{' '}
          <ThemedText type="code">.env</ThemedText>
        </ThemedText>
        <ThemedText type="small" style={styles.text}>
          2. Supabase → Authentication → Providers → enable <ThemedText type="code">Google</ThemedText>
        </ThemedText>
        <ThemedText type="small" style={styles.text}>
          3. Google Cloud OAuth client; redirect URI:{' '}
          <ThemedText type="code">https://YOUR_PROJECT.supabase.co/auth/v1/callback</ThemedText>
        </ThemedText>
        <ThemedText type="small" style={styles.text}>
          4. Supabase → URL Configuration → add redirect <ThemedText type="code">dai1yl0g://**</ThemedText>
        </ThemedText>
        <ThemedText type="small" style={styles.text}>
          5. Run SQL: <ThemedText type="code">supabase/migrations/001_profiles.sql</ThemedText>
        </ThemedText>
        <ThemedText type="small" style={styles.text}>
          6. Restart Metro: <ThemedText type="code">npx expo start -c</ThemedText>
        </ThemedText>
      </View>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.two,
  },
  text: {
    color: AuthColors.text,
    lineHeight: 22,
  },
});
