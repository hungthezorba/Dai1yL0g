import { PlayfulColors } from '@/design/tokens';

/** Auth / onboarding — re-export playful tokens for feature code. */
export const AuthColors = {
  primary: PlayfulColors.primary,
  primaryMuted: PlayfulColors.primaryMuted,
  background: PlayfulColors.backgroundWarm,
  text: PlayfulColors.ink,
  textSecondary: PlayfulColors.inkMuted,
  surface: PlayfulColors.surfaceElevated,
  border: PlayfulColors.borderPink,
  error: PlayfulColors.error,
  cta: PlayfulColors.cta,
  brand: PlayfulColors.brand,
} as const;
