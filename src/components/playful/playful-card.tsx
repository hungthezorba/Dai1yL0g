import { StyleSheet, View, type ViewProps } from 'react-native';

import { Spacing } from '@/constants/theme';
import { PlayfulColors, PlayfulRadius, PlayfulShadow } from '@/design/tokens';

type PlayfulCardProps = ViewProps & {
  elevated?: boolean;
};

export function PlayfulCard({ style, elevated, children, ...rest }: PlayfulCardProps) {
  return (
    <View style={[styles.card, elevated && styles.elevated, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: PlayfulColors.surface,
    borderRadius: PlayfulRadius.lg,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  elevated: {
    backgroundColor: PlayfulColors.surfaceElevated,
    borderWidth: 2,
    borderColor: PlayfulColors.border,
    ...PlayfulShadow.card,
  },
});
