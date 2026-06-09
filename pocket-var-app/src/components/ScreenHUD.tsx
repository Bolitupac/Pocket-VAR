import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

/**
 * ScreenHUD
 *
 * Shared top navigation bar used across all screens.
 * Left:   pocketvarlogoVAR.png (white badge container so black logo reads on dark bg)
 * Center: screen title in small caps
 * Right:  optional badge / pill slot (pass as `right` prop)
 */

type ScreenHUDProps = {
  title: string;
  right?: React.ReactNode;
};

export function ScreenHUD({ title, right }: ScreenHUDProps) {
  return (
    <View style={styles.hud}>
      {/* ── Logo image in a white stamp badge ─── */}
      <View style={styles.logoBadge}>
        <Image
          source={require('../../assets/images/pocketvarlogo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* ── Screen title ─── */}
      <Text style={styles.title}>{title}</Text>

      {/* ── Right slot ─── */}
      <View style={styles.rightSlot}>
        {right ?? null}
      </View>
    </View>
  );
}

// ── Shared badge pill used by screens ──────────────────────────

type HUDBadgeProps = {
  label: string;
  color?: string;
};

export function HUDBadge({ label, color = colors.primary }: HUDBadgeProps) {
  return (
    <View style={[styles.badge, { borderColor: color, backgroundColor: `${color}18` }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hud: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xxxl + spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: 'rgba(8, 11, 8, 0.72)',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },

  // White "stamp" container — makes black logo legible on dark bg
  logoBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    paddingHorizontal: 7,
    paddingVertical: 3,
    width: 80,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 72,
    height: 32,
  },

  title: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    color: colors.textSecondary,
  },

  rightSlot: {
    width: 80,
    alignItems: 'flex-end',
  },

  // Reusable badge pill
  badge: {
    borderRadius: 99,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});
