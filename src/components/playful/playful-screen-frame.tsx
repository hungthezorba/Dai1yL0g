import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { PlayfulColors } from '@/design/tokens';

type PlayfulScreenFrameProps = ViewProps & {
  warm?: boolean;
  children: React.ReactNode;
};

export function PlayfulScreenFrame({ warm, style, children, ...rest }: PlayfulScreenFrameProps) {
  return (
    <View style={[styles.outer, warm && styles.outerWarm]}>
      <SafeAreaView style={[styles.safe, style]} {...rest}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: PlayfulColors.frame,
    padding: 3,
  },
  outerWarm: {
    backgroundColor: PlayfulColors.frameMuted,
  },
  safe: {
    flex: 1,
    backgroundColor: PlayfulColors.background,
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
});
