/**
 * Pocket VAR — Design Token System
 *
 * Dark-mode-first palette with tiger orange (#FF6600) as the primary accent.
 * All tokens are exported as plain objects so they tree-shake cleanly.
 */

// ── Color Palette ──────────────────────────────────────────────

export const colors = {
  // Foundation
  background: '#0D0D0D',       // near-black — minimises glare outdoors
  surface: '#1A1A1E',           // card surfaces, subtle blue-black tint
  surfaceLight: '#252529',      // elevated surfaces, glass panels
  surfaceGlass: 'rgba(26, 26, 30, 0.72)', // glassmorphism frosted overlay

  // Brand accent — tiger orange
  primary: '#FF6600',           // CTAs, key metrics, active states
  primaryDark: '#CC5200',       // pressed / hover state
  primaryDim: 'rgba(255, 102, 0, 0.15)', // glow, selection highlight
  primaryGlass: 'rgba(255, 102, 0, 0.12)', // subtle orange glass overlay

  // Text hierarchy
  text: '#FFFFFF',
  textSecondary: '#A0A0A8',
  textDim: '#666670',

  // Semantic event colours (matched to real-world VAR / referee signals)
  goal: '#00FF88',              // green — universal "goal" signal
  foul: '#FF6600',              // orange — also the primary brand accent
  offside: '#FFD700',           // gold — AR flag colour
  yellowCard: '#FFD700',
  redCard: '#FF3355',

  // Recording state
  recording: '#FF3355',         // red REC dot + timer pill

  // Utility
  border: 'rgba(255, 255, 255, 0.08)',
  divider: 'rgba(255, 255, 255, 0.06)',
};

// ── Semantic colour lookup by event type ───────────────────────

export const eventColor = (type: string): string => {
  const map: Record<string, string> = {
    goal: colors.goal,
    foul: colors.foul,
    offside: colors.offside,
    yellow_card: colors.yellowCard,
    red_card: colors.redCard,
  };
  return map[type] ?? colors.primary;
};

// ── Spacing Scale (4 px base) ──────────────────────────────────

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// ── Border Radius ──────────────────────────────────────────────

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
};

// ── Typography ─────────────────────────────────────────────────
//
// Font family: system sans-serif (SF Pro on iOS, Roboto on Android).
// Canva Sans is the brand reference; system bold sans-serif is the
// closest available without embedding a custom font.

const base = { fontFamily: undefined as string | undefined };

export const typography = {
  h1: { ...base, fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  h2: { ...base, fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  h3: { ...base, fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { ...base, fontSize: 16, fontWeight: '400' as const, lineHeight: 22 },
  bodySmall: { ...base, fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { ...base, fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  button: { ...base, fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
  label: { ...base, fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
  logo: { ...base, fontSize: 24, fontWeight: '800' as const, letterSpacing: 2 },
};

// ── Shadows (iOS shadow, Android elevation mapped) ─────────────

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  glow: (c: string = colors.primary) => ({
    shadowColor: c,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  }),
};
