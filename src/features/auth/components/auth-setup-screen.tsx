import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { AuthColors } from '@/features/auth/design-tokens';

import { AuthScreenShell } from './auth-screen-shell';

export function AuthSetupScreen() {
  return (
    <AuthScreenShell
      title="Connect Supabase"
      subtitle="Auth needs a Supabase project before you can sign in with phone OTP.">
      <View style={styles.body}>
        <ThemedText type="small" style={styles.text}>
          1. Copy <ThemedText type="code">.env.example</ThemedText> to{' '}
          <ThemedText type="code">.env</ThemedText>
        </ThemedText>
        <ThemedText type="small" style={styles.text}>
          2. Set <ThemedText type="code">EXPO_PUBLIC_SUPABASE_URL</ThemedText> and{' '}
          <ThemedText type="code">EXPO_PUBLIC_SUPABASE_ANON_KEY</ThemedText>
        </ThemedText>
        <ThemedText type="small" style={styles.text}>
          3. Enable Phone provider in Supabase → Authentication
        </ThemedText>
        <ThemedText type="small" style={styles.text}>
          4. Run SQL in <ThemedText type="code">supabase/migrations/001_profiles.sql</ThemedText>
        </ThemedText>
        <ThemedText type="small" style={styles.text}>
          5. Restart Metro: <ThemedText type="code">npx expo start -c</ThemedText>
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
