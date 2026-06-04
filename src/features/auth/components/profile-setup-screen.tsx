import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/auth-context';
import { AuthColors } from '@/features/auth/design-tokens';
import { getDeviceTimezone } from '@/features/auth/device-timezone';
import { getGoogleProfilePrefill } from '@/features/auth/google-prefill';
import { upsertProfile } from '@/features/auth/profile-service';

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
      subtitle="Your friends will see this name. Username is unique.">
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
      <Pressable
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={() => void onSave()}
        disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <ThemedText type="smallBold" style={styles.buttonLabel}>
            Start capturing
          </ThemedText>
        )}
      </Pressable>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  label: {
    color: AuthColors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: AuthColors.border,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    color: AuthColors.text,
    backgroundColor: AuthColors.background,
  },
  hint: {
    color: AuthColors.textSecondary,
  },
  error: {
    color: AuthColors.error,
  },
  button: {
    backgroundColor: AuthColors.primary,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonLabel: {
    color: '#FFFFFF',
  },
});
