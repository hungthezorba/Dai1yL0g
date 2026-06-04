import { Pressable, StyleSheet, View } from 'react-native';

import { CaptureColors, CaptureLayout } from '@/features/capture/design-tokens';
import type { RecorderPhase } from '@/features/capture/hooks/use-clip-recorder';

type RecordButtonProps = {
  phase: RecorderPhase;
  disabled: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
};

export function RecordButton({ phase, disabled, onPressIn, onPressOut }: RecordButtonProps) {
  const isRecording = phase === 'recording';
  const isSaving = phase === 'saving';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isRecording ? 'Release to save clip' : 'Hold to record clip'}
      disabled={disabled || isSaving}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={({ pressed }) => [
        styles.outer,
        (pressed || isRecording) && styles.outerActive,
        (disabled || isSaving) && styles.outerDisabled,
      ]}>
      <View style={[styles.inner, isRecording && styles.innerRecording]} />
    </Pressable>
  );
}

const size = CaptureLayout.recordButtonSize;

const styles = StyleSheet.create({
  outer: {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: CaptureLayout.recordRingWidth,
    borderColor: CaptureColors.onCameraText,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  outerActive: {
    borderColor: CaptureColors.primary,
    transform: [{ scale: 1.05 }],
  },
  outerDisabled: {
    opacity: 0.45,
  },
  inner: {
    width: size - 20,
    height: size - 20,
    borderRadius: (size - 20) / 2,
    backgroundColor: CaptureColors.primary,
  },
  innerRecording: {
    width: size - 28,
    height: size - 28,
    borderRadius: 8,
    backgroundColor: CaptureColors.primaryMuted,
  },
});
