/**
 * Pocket VAR — Design Token System
 *
 * Clean, professional dark palette. Green is used sparingly as a
 * functional accent for recording, active states, and semantic events
 * — never for decoration.
 */

// ── Color Palette ──────────────────────────────────────────────

export const colors = {
  // Foundation
  background: '#0D0D0D',          // near-black
  surface: '#1A1A1A',             // dark card surface
  surfaceLight: '#242424',        // elevated surface

  // Brand accent — kept subtle, used only for active/functional states
  primary: '#22C55E',
  primaryDark: '#16A34A',
  primaryMuted: 'rgba(34, 197, 94, 0.18)',

  // Text hierarchy
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textDim: '#5C5C5C',

  // Semantic event colours (matched to real-world VAR / referee signals)
  goal: '#22C55E',
  foul: '#F97316',
  offside: '#FFD700',
  yellowCard: '#FFD700',
  redCard: '#FF3355',

  // Recording state
  recording: '#FF3355',

  // Utility — neutral, no green tint
  border: 'rgba(255, 255, 255, 0.08)',
  divider: 'rgba(255, 255, 255, 0.05)',
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
