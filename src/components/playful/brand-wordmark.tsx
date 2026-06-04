import { StyleSheet, Text, type TextProps } from 'react-native';

import { AppFonts } from '@/hooks/use-app-fonts';
import { PlayfulColors } from '@/design/tokens';

type BrandWordmarkProps = TextProps & {
  size?: 'lg' | 'md' | 'sm';
  onDark?: boolean;
};

export function BrandWordmark({ size = 'lg', onDark, style, ...rest }: BrandWordmarkProps) {
  return (
    <Text
      style={[
        styles.base,
        size === 'lg' && styles.lg,
        size === 'md' && styles.md,
        size === 'sm' && styles.sm,
        onDark ? styles.onDark : styles.onLight,
        style,
      ]}
      {...rest}>
      Dai1yL0g
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: AppFonts.display,
    letterSpacing: -0.5,
  },
  lg: {
    fontSize: 42,
    lineHeight: 46,
  },
  md: {
    fontSize: 32,
    lineHeight: 36,
  },
  sm: {
    fontSize: 24,
    lineHeight: 28,
  },
  onLight: {
    color: PlayfulColors.brand,
  },
  onDark: {
    color: PlayfulColors.onDark,
  },
});
