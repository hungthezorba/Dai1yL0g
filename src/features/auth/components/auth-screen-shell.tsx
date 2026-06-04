import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BrandWordmark } from '@/components/playful/brand-wordmark';
import { PlayfulCard } from '@/components/playful/playful-card';
import { PlayfulDoodleCluster } from '@/components/playful/playful-doodles';
import { PlayfulScreenFrame } from '@/components/playful/playful-screen-frame';
import { Spacing } from '@/constants/theme';
import { PlayfulColors } from '@/design/tokens';
import { AuthColors } from '@/features/auth/design-tokens';
import { AppFonts } from '@/hooks/use-app-fonts';

type AuthScreenShellProps = {
  title: string;
  subtitle?: string;
  showDoodles?: boolean;
  children: React.ReactNode;
};

export function AuthScreenShell({ title, subtitle, showDoodles = true, children }: AuthScreenShellProps) {
  return (
    <PlayfulScreenFrame warm>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {showDoodles ? <PlayfulDoodleCluster compact /> : null}
          <View style={styles.header}>
            <BrandWordmark />
            <ThemedText style={styles.title}>{title}</ThemedText>
            {subtitle ? (
              <ThemedText type="small" style={styles.subtitle}>
                {subtitle}
              </ThemedText>
            ) : null}
          </View>
          <PlayfulCard elevated style={styles.card}>
            {children}
          </PlayfulCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </PlayfulScreenFrame>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: AuthColors.background,
  },
  scroll: {
    flexGrow: 1,
    padding: Spacing.four,
    justifyContent: 'center',
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.two,
    alignItems: 'center',
  },
  title: {
    fontFamily: AppFonts.bodySemi,
    fontSize: 22,
    lineHeight: 28,
    color: PlayfulColors.ink,
    textAlign: 'center',
  },
  subtitle: {
    color: AuthColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: AppFonts.body,
  },
  card: {
    gap: Spacing.three,
  },
});
