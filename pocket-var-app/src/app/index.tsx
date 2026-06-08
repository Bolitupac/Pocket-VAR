import { View, StyleSheet, Text } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { FloatingTabBar } from '../components/FloatingTabBar';

/**
 * CameraScreen — main recording screen.
 * Full-screen camera placeholder with floating glass tab bar.
 */

export default function CameraScreen() {
  return (
    <View style={styles.root}>

      {/* ── Top HUD ──────────────────────────────── */}
      <View style={styles.hud}>
        {/* Logo */}
        <View style={styles.logoWrap}>
          <Text style={styles.logoPocket}>POCKET</Text>
          <Text style={styles.logoVar}>VAR</Text>
        </View>

        {/* REC badge */}
        <View style={styles.recBadge}>
          <View style={styles.recDot} />
          <Text style={styles.recLabel}>REC</Text>
        </View>

        {/* Timer */}
        <Text style={styles.timer}>00:00</Text>
      </View>

      {/* ── Camera Viewfinder ─────────────────────── */}
      <View style={styles.viewfinder}>
        {/* Corner brackets — mimics a real camera UI */}
        <View style={[styles.corner, styles.tl]} />
        <View style={[styles.corner, styles.tr]} />
        <View style={[styles.corner, styles.bl]} />
        <View style={[styles.corner, styles.br]} />

        <Text style={styles.cameraIcon}>📷</Text>
        <Text style={styles.viewfinderLabel}>Camera preview</Text>
        <Text style={styles.viewfinderHint}>expo-camera will render here</Text>
      </View>

      {/* ── Floating Tab Bar ─────────────────────── */}
      <FloatingTabBar />
    </View>
  );
}

const CORNER = 22;
const BORDER = 2.5;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── HUD
  hud: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xxxl + spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: 'rgba(8, 11, 8, 0.60)',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  logoWrap: {
    alignItems: 'flex-start',
  },
  logoPocket: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: colors.textSecondary,
    lineHeight: 10,
  },
  logoVar: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
    color: colors.primary,
    lineHeight: 22,
  },
  recBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 51, 85, 0.15)',
    borderRadius: 99,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 51, 85, 0.30)',
  },
  recDot: {
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: colors.recording,
    marginRight: 6,
  },
  recLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.recording,
  },
  timer: {
    ...typography.label,
    color: colors.text,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },

  // ── Viewfinder
  viewfinder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.xl,
    marginTop: spacing.xxxl + spacing.xxxl + spacing.xl,
    marginBottom: 110,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Corner brackets
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: colors.primary,
  },
  tl: { top: 12, left: 12,  borderTopWidth: BORDER, borderLeftWidth: BORDER,  borderTopLeftRadius: 6 },
  tr: { top: 12, right: 12, borderTopWidth: BORDER, borderRightWidth: BORDER, borderTopRightRadius: 6 },
  bl: { bottom: 12, left: 12,  borderBottomWidth: BORDER, borderLeftWidth: BORDER,  borderBottomLeftRadius: 6 },
  br: { bottom: 12, right: 12, borderBottomWidth: BORDER, borderRightWidth: BORDER, borderBottomRightRadius: 6 },

  cameraIcon: {
    fontSize: 40,
    marginBottom: spacing.md,
  },
  viewfinderLabel: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  viewfinderHint: {
    ...typography.caption,
    color: colors.textDim,
    marginTop: spacing.sm,
  },
});
