/**
 * Pocket VAR — Theme
 * Minimalist black & green palette optimized for outdoor readability
 */

export const colors = {
  // Core
  background: '#0D0D0D',
  surface: '#1A1A1E',
  surfaceLight: '#252529',
  card: '#1E1E22',

  // Primary
  primary: '#00FF88',
  primaryDark: '#00CC6A',
  primaryDim: 'rgba(0, 255, 136, 0.15)',

  // Text
  text: '#FFFFFF',
  textSecondary: '#A0A0A8',
  textDim: '#666670',

  // Accents
  goal: '#00FF88',
  foul: '#FF6600',
  offside: '#FFD700',
  yellowCard: '#FFD700',
  redCard: '#FF3355',
  whiteCard: '#CCCCCC',

  // UI
  border: '#2A2A30',
  divider: '#222228',
  danger: '#FF3355',
  success: '#00FF88',
  warning: '#FFD700',
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',

  // Recording
  recording: '#FF3355',
  recordingPulse: 'rgba(255, 51, 85, 0.3)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700', color: colors.text },
  h2: { fontSize: 22, fontWeight: '700', color: colors.text },
  h3: { fontSize: 18, fontWeight: '600', color: colors.text },
  body: { fontSize: 16, fontWeight: '400', color: colors.text },
  bodySmall: { fontSize: 14, fontWeight: '400', color: colors.textSecondary },
  caption: { fontSize: 12, fontWeight: '400', color: colors.textDim },
  button: { fontSize: 16, fontWeight: '600', color: colors.background },
  label: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  round: 999,
};
