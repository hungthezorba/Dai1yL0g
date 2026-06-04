/** SETLOG-inspired joyful UI — claymorphism + playful accents. */
export const PlayfulColors = {
  frame: '#FF2D8A',
  frameMuted: '#FF8FC7',
  brand: '#1CCFC9',
  brandDark: '#0EA5A0',
  primary: '#E11D48',
  primaryMuted: '#FB7185',
  accentYellow: '#FFD24A',
  accentPurple: '#A78BFA',
  ink: '#111111',
  inkMuted: '#525252',
  background: '#FFFFFF',
  backgroundWarm: '#FFF8FA',
  surface: '#F3F3F6',
  surfaceElevated: '#FFFFFF',
  border: '#E8E8ED',
  borderPink: '#FECDD3',
  onDark: '#FFFFFF',
  success: '#22C55E',
  warning: '#EAB308',
  error: '#DC2626',
  cta: '#111111',
} as const;

export const PlayfulRadius = {
  sm: 12,
  md: 20,
  lg: 28,
  xl: 36,
  pill: 999,
} as const;

export const PlayfulShadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  soft: {
    shadowColor: PlayfulColors.frame,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;
