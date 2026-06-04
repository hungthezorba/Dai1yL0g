import { PlayfulColors } from '@/design/tokens';

/** Capture overlay — pink ring + teal accents on camera. */
export const CaptureColors = {
  primary: PlayfulColors.primary,
  primaryMuted: PlayfulColors.primaryMuted,
  brand: PlayfulColors.brand,
  frame: PlayfulColors.frame,
  onCameraText: PlayfulColors.onDark,
  overlay: 'rgba(17,17,17,0.42)',
  timelineBg: 'rgba(17,17,17,0.72)',
  success: PlayfulColors.success,
  warning: PlayfulColors.warning,
} as const;

export const CaptureLayout = {
  recordButtonSize: 72,
  recordRingWidth: 4,
  clipThumbSize: 64,
  transitionMs: 200,
} as const;
