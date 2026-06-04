import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PillButton } from '@/components/playful/pill-button';
import { Spacing } from '@/constants/theme';
import { PlayfulColors, PlayfulRadius } from '@/design/tokens';
import { useAuth } from '@/features/auth/auth-context';
import { AuthColors } from '@/features/auth/design-tokens';
import { getDeviceTimezone } from '@/features/auth/device-timezone';
import { getGoogleProfilePrefill } from '@/features/auth/google-prefill';
import { upsertProfile } from '@/features/auth/profile-service';
import { AppFonts } from '@/hooks/use-app-fonts';

import { AuthScreenShell } from './auth-screen-shell';

export function ProfileSetupScreen() {
  const router = useRouter();
  const { session, refreshProfile } = useAuth();
  const defaultTimezone = useMemo(() => getDeviceTimezone(), []);
  const googlePrefill = useMemo(() => getGoogleProfilePrefill(session), [session]);

  const [displayName, setDisplayName] = useState(googlePrefill.displayName);
  const [username, setUsername] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!session?.user.id) {
    router.replace('/(auth)/sign-in');
    return null;
  }

  const onSave = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await upsertProfile(session.user.id, {
        displayName,
        username,
        timezone: defaultTimezone,
        birthYear: Number(birthYear),
        avatarUrl: googlePrefill.avatarUrl,
      });
      await refreshProfile();
      router.replace('/(app)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreenShell
      title="Set up your profile"
      subtitle="Your friends will see this name. Pick a unique username.">
      <ThemedText type="small" style={styles.label}>
        Display name
      </ThemedText>
      <TextInput
        accessibilityLabel="Display name"
        autoCapitalize="words"
        placeholder="Alex"
        placeholderTextColor={AuthColors.textSecondary}
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
        editable={!submitting}
      />
      <ThemedText type="small" style={styles.label}>
        Username
      </ThemedText>
      <TextInput
        accessibilityLabel="Username"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="alex_daily"
        placeholderTextColor={AuthColors.textSecondary}
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        editable={!submitting}
      />
      <ThemedText type="small" style={styles.label}>
        Birth year
      </ThemedText>
      <TextInput
        accessibilityLabel="Birth year"
        keyboardType="number-pad"
        placeholder="1998"
        placeholderTextColor={AuthColors.textSecondary}
        style={styles.input}
        value={birthYear}
        onChangeText={setBirthYear}
        editable={!submitting}
        maxLength={4}
      />
      <ThemedText type="small" style={styles.hint}>
        Timezone: {defaultTimezone} (from device)
      </ThemedText>
      {error ? (
        <ThemedText type="small" style={styles.error}>
          {error}
        </ThemedText>
      ) : null}
      <PillButton
        label="Start capturing"
        variant="brand"
        loading={submitting}
        onPress={() => void onSave()}
        disabled={submitting}
      />
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  label: {
    color: AuthColors.text,
    fontFamily: AppFonts.bodySemi,
  },
  input: {
    borderWidth: 2,
    borderColor: PlayfulColors.border,
    borderRadius: PlayfulRadius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    fontFamily: AppFonts.body,
    color: AuthColors.text,
    backgroundColor: PlayfulColors.surface,
  },
  hint: {
    color: AuthColors.textSecondary,
    fontFamily: AppFonts.body,
  },
  error: {
    color: AuthColors.error,
    fontFamily: AppFonts.body,
  },
});
