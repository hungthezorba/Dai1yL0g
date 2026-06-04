import { ActivityIndicator, Pressable, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { PlayfulColors, PlayfulRadius } from '@/design/tokens';

type PillButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: 'dark' | 'brand' | 'outline';
  loading?: boolean;
  style?: ViewStyle;
};

export function PillButton({
  label,
  variant = 'dark',
  loading,
  disabled,
  style,
  ...rest
}: PillButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        variant === 'dark' && styles.dark,
        variant === 'brand' && styles.brand,
        variant === 'outline' && styles.outline,
        (pressed || loading) && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? PlayfulColors.ink : PlayfulColors.onDark} />
      ) : (
        <ThemedText type="smallBold" style={[styles.label, variant === 'outline' && styles.labelOutline]}>
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: PlayfulRadius.pill,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  dark: {
    backgroundColor: PlayfulColors.cta,
  },
  brand: {
    backgroundColor: PlayfulColors.primary,
  },
  outline: {
    backgroundColor: PlayfulColors.surfaceElevated,
    borderWidth: 2,
    borderColor: PlayfulColors.border,
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    color: PlayfulColors.onDark,
    fontSize: 16,
  },
  labelOutline: {
    color: PlayfulColors.ink,
  },
});
