import { View, StyleSheet, Text } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { FloatingTabBar } from '../components/FloatingTabBar';

/**
 * ReviewScreen — last 60s VAR review with timeline scrub + frame stepping.
 * Stub: placeholder with premium glass UI and floating tab bar.
 */

export default function ReviewScreen() {
  return (
    <View style={styles.root}>

      {/* ── Top HUD ───────────────────────────────────── */}
      <View style={styles.hud}>
        <View style={styles.logoWrap}>
          <Text style={styles.logoPocket}>POCKET</Text>
          <Text style={styles.logoVar}>VAR</Text>
        </View>
        <Text style={styles.screenTitle}>REVIEW</Text>
        <View style={styles.badgeWrap}>
          <Text style={styles.badgeText}>60s</Text>
        </View>
      </View>

      {/* ── Video Placeholder ─────────────────────────── */}
      <View style={styles.videoArea}>
        {/* Corner brackets */}
        <View style={[styles.corner, styles.tl]} />
        <View style={[styles.corner, styles.tr]} />
        <View style={[styles.corner, styles.bl]} />
        <View style={[styles.corner, styles.br]} />

        <Text style={styles.areaIcon}>🎞</Text>
        <Text style={styles.areaLabel}>Video Review</Text>
        <Text style={styles.areaHint}>Last 60s video + frame stepper</Text>
      </View>

      {/* ── Timeline Scrubber Placeholder ─────────────── */}
      <View style={styles.timeline}>
        <View style={styles.timelineTrack}>
          <View style={styles.timelineHead} />
        </View>
        <View style={styles.timelineLabels}>
          <Text style={styles.timelineLabelText}>-60s</Text>
          <Text style={styles.timelineLabelText}>-30s</Text>
          <Text style={styles.timelineLabelText}>Now</Text>
        </View>
      </View>

      {/* ── Floating Tab Bar ──────────────────────────── */}
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
  logoWrap: { alignItems: 'flex-start' },
  logoPocket: {
    fontSize: 8, fontWeight: '700', letterSpacing: 2.5,
    color: colors.textSecondary, lineHeight: 10,
  },
  logoVar: {
    fontSize: 20, fontWeight: '900', letterSpacing: 1,
    color: colors.primary, lineHeight: 22,
  },
  screenTitle: {
    fontSize: 12, fontWeight: '700', letterSpacing: 3,
    color: colors.textSecondary,
  },
  badgeWrap: {
    backgroundColor: colors.primaryGlass,
    borderRadius: 99,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1,
    color: colors.primary,
  },

  // ── Video area
  videoArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
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
  areaIcon: { fontSize: 40, marginBottom: spacing.md },
  areaLabel: { ...typography.h3, color: colors.textSecondary },
  areaHint:  { ...typography.caption, color: colors.textDim, marginTop: spacing.sm },

  // ── Timeline
  timeline: {
    marginHorizontal: spacing.xl,
    marginBottom: 110,
  },
  timelineTrack: {
    height: 4,
    backgroundColor: colors.surface,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  timelineHead: {
    width: '35%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 99,
  },
  timelineLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timelineLabelText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textDim,
    letterSpacing: 0.5,
  },
});
