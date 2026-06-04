import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BrandWordmark } from '@/components/playful/brand-wordmark';
import { PlayfulCard } from '@/components/playful/playful-card';
import { PlayfulScreenFrame } from '@/components/playful/playful-screen-frame';
import { PillButton } from '@/components/playful/pill-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { PlayfulColors } from '@/design/tokens';
import { useAuth } from '@/features/auth/auth-context';
import { AppFonts } from '@/hooks/use-app-fonts';

function SmileyBadge() {
  return (
    <View style={styles.smiley}>
      <View style={styles.smileyEyes}>
        <View style={styles.smileyDot} />
        <View style={styles.smileyDot} />
      </View>
      <View style={styles.smileyMouth} />
    </View>
  );
}

export default function ExploreScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const { profile, signOut } = useAuth();

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  return (
    <PlayfulScreenFrame>
      <ScrollView contentInset={insets} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BrandWordmark size="md" />
          <ThemedText type="small" style={styles.tagline}>
            your space · each day runs 4am to 4am
          </ThemedText>
        </View>

        <PlayfulCard style={styles.vlogCard}>
          <View style={styles.vlogRow}>
            <View style={styles.vlogCopy}>
              <ThemedText style={styles.vlogTitle}>vlog</ThemedText>
              <ThemedText type="small" style={styles.vlogSubtitle}>
                moments with close friends
              </ThemedText>
            </View>
            <View style={styles.starMini}>
              <View style={styles.starMiniInner} />
            </View>
          </View>
        </PlayfulCard>

        {profile ? (
          <PlayfulCard elevated>
            <View style={styles.profileRow}>
              <SmileyBadge />
              <View style={styles.profileCopy}>
                <ThemedText style={styles.profileName}>{profile.displayName}</ThemedText>
                <ThemedText type="small" style={styles.profileMeta}>
                  @{profile.username} · {profile.timezone}
                </ThemedText>
              </View>
            </View>
          </PlayfulCard>
        ) : null}

        <PillButton label="Sign out" variant="outline" onPress={() => void signOut()} style={styles.signOut} />

        {Platform.OS === 'web' ? (
          <ThemedText type="small" style={styles.webHint}>
            Capture requires a development build on device.
          </ThemedText>
        ) : null}
      </ScrollView>
    </PlayfulScreenFrame>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    width: '100%',
    gap: Spacing.one,
  },
  tagline: {
    color: PlayfulColors.primaryMuted,
    fontFamily: AppFonts.body,
  },
  vlogCard: {
    width: '100%',
  },
  vlogRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vlogCopy: {
    gap: 4,
    flex: 1,
  },
  vlogTitle: {
    fontFamily: AppFonts.displaySemi,
    fontSize: 28,
    color: PlayfulColors.ink,
  },
  vlogSubtitle: {
    color: PlayfulColors.inkMuted,
    fontFamily: AppFonts.body,
  },
  starMini: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starMiniInner: {
    width: 36,
    height: 36,
    backgroundColor: PlayfulColors.accentYellow,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: PlayfulColors.ink,
    transform: [{ rotate: '45deg' }],
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  profileCopy: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontFamily: AppFonts.bodyBold,
    fontSize: 18,
    color: PlayfulColors.ink,
  },
  profileMeta: {
    color: PlayfulColors.inkMuted,
    fontFamily: AppFonts.body,
  },
  smiley: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PlayfulColors.frame,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  smileyEyes: {
    flexDirection: 'row',
    gap: 8,
  },
  smileyDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: PlayfulColors.onDark,
  },
  smileyMouth: {
    width: 10,
    height: 5,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: PlayfulColors.onDark,
  },
  signOut: {
    alignSelf: 'stretch',
  },
  webHint: {
    color: PlayfulColors.inkMuted,
    textAlign: 'center',
    fontFamily: AppFonts.body,
  },
});
