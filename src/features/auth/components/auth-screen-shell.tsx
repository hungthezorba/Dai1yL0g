import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { AuthColors } from '@/features/auth/design-tokens';

type AuthScreenShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AuthScreenShell({ title, subtitle, children }: AuthScreenShellProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.brand}>
              Dai1yL0g
            </ThemedText>
            <ThemedText type="subtitle" style={styles.title}>
              {title}
            </ThemedText>
            {subtitle ? (
              <ThemedText type="small" style={styles.subtitle}>
                {subtitle}
              </ThemedText>
            ) : null}
          </View>
          <View style={styles.card}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: AuthColors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    padding: Spacing.four,
    justifyContent: 'center',
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.two,
    alignItems: 'center',
  },
  brand: {
    color: AuthColors.primary,
  },
  title: {
    color: AuthColors.text,
    textAlign: 'center',
  },
  subtitle: {
    color: AuthColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: AuthColors.surface,
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: AuthColors.border,
  },
});
