import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AuthColors } from '@/features/auth/design-tokens';

type Props = {
  submitting: boolean;
  onPress: () => void;
};

export function GoogleSignInNativeButton({ submitting, onPress }: Props) {
  return (
    <View style={styles.buttonRow}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={onPress}
        disabled={submitting}
        style={styles.googleButton}
      />
      {submitting ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={AuthColors.cta} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    alignItems: 'center',
    minHeight: 48,
  },
  googleButton: {
    width: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
});
