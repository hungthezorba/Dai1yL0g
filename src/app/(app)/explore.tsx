import { Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/auth-context';
import { AuthColors } from '@/features/auth/design-tokens';
import { useTheme } from '@/hooks/use-theme';

export default function ExploreScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const { profile, signOut } = useAuth();

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={styles.content}>
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle">Account</ThemedText>
        {profile ? (
          <ThemedView style={styles.card}>
            <ThemedText type="default">{profile.displayName}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              @{profile.username} · {profile.timezone}
            </ThemedText>
          </ThemedView>
        ) : null}
        <Pressable style={styles.signOut} onPress={() => void signOut()}>
          <ThemedText type="smallBold" style={styles.signOutLabel}>
            Sign out
          </ThemedText>
        </Pressable>
        {Platform.OS === 'web' ? (
          <ThemedText type="small" themeColor="textSecondary">
            Capture requires a development build on device.
          </ThemedText>
        ) : null}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    alignItems: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    width: '100%',
    gap: Spacing.three,
  },
  card: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  signOut: {
    alignSelf: 'flex-start',
    backgroundColor: AuthColors.primary,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  signOutLabel: {
    color: '#FFFFFF',
  },
});
