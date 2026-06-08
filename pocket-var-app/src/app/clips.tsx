import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { FloatingTabBar } from '../components/FloatingTabBar';

/**
 * ClipsScreen — saved clips library, 2-column grid.
 * Stub: placeholder tiles with premium glass UI and floating tab bar.
 */

const MOCK_CLIPS = [
  { id: '1', label: 'Goal #1',    time: '02:14', tag: 'GOAL',   color: colors.goal },
  { id: '2', label: 'Foul #3',    time: '18:42', tag: 'FOUL',   color: colors.foul },
  { id: '3', label: 'Offside',    time: '33:07', tag: 'OFFSID', color: colors.offside },
  { id: '4', label: 'Goal #2',    time: '51:29', tag: 'GOAL',   color: colors.goal },
  { id: '5', label: 'Yellow #2',  time: '67:55', tag: 'YC',     color: colors.yellowCard },
  { id: '6', label: 'Red Card',   time: '78:01', tag: 'RC',     color: colors.redCard },
];

export default function ClipsScreen() {
  return (
    <View style={styles.root}>

      {/* ── Top HUD ─────────────────────────────── */}
      <View style={styles.hud}>
        <View style={styles.logoWrap}>
          <Text style={styles.logoPocket}>POCKET</Text>
          <Text style={styles.logoVar}>VAR</Text>
        </View>
        <Text style={styles.screenTitle}>CLIPS</Text>
        <View style={styles.badgeWrap}>
          <Text style={styles.badgeText}>{MOCK_CLIPS.length} SAVED</Text>
        </View>
      </View>

      {/* ── Clips Grid ──────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_CLIPS.map((clip) => (
          <View key={clip.id} style={styles.card}>
            {/* Thumbnail placeholder */}
            <View style={styles.thumb}>
              {/* Corner brackets */}
              <View style={[styles.corner, styles.tl, { borderColor: clip.color }]} />
              <View style={[styles.corner, styles.tr, { borderColor: clip.color }]} />
              <View style={[styles.corner, styles.bl, { borderColor: clip.color }]} />
              <View style={[styles.corner, styles.br, { borderColor: clip.color }]} />
              <Text style={styles.thumbIcon}>🎬</Text>
            </View>

            {/* Card meta */}
            <View style={styles.cardMeta}>
              <Text style={styles.cardLabel} numberOfLines={1}>{clip.label}</Text>
              <View style={styles.cardRow}>
                <View style={[styles.tagPill, { borderColor: clip.color, backgroundColor: `${clip.color}18` }]}>
                  <Text style={[styles.tagText, { color: clip.color }]}>{clip.tag}</Text>
                </View>
                <Text style={styles.cardTime}>{clip.time}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ── Floating Tab Bar ────────────────────── */}
      <FloatingTabBar />
    </View>
  );
}

const CORNER = 14;
const BORDER = 2;

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
    fontSize: 10, fontWeight: '700', letterSpacing: 0.8,
    color: colors.primary,
  },

  // ── Grid
  scroll: { flex: 1 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 120,         // clear the floating tab bar
    gap: spacing.md,
  },

  // ── Card
  card: {
    width: '47.5%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  thumb: {
    height: 90,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
  },
  tl: { top: 8, left: 8,  borderTopWidth: BORDER, borderLeftWidth: BORDER,  borderTopLeftRadius: 4 },
  tr: { top: 8, right: 8, borderTopWidth: BORDER, borderRightWidth: BORDER, borderTopRightRadius: 4 },
  bl: { bottom: 8, left: 8,  borderBottomWidth: BORDER, borderLeftWidth: BORDER,  borderBottomLeftRadius: 4 },
  br: { bottom: 8, right: 8, borderBottomWidth: BORDER, borderRightWidth: BORDER, borderBottomRightRadius: 4 },
  thumbIcon: { fontSize: 28 },

  cardMeta: { padding: spacing.md },
  cardLabel: {
    fontSize: 13, fontWeight: '600', color: colors.text,
    marginBottom: spacing.xs,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagPill: {
    borderRadius: 99,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 9, fontWeight: '800', letterSpacing: 1.2,
  },
  cardTime: {
    fontSize: 11, fontWeight: '500',
    color: colors.textDim,
    fontVariant: ['tabular-nums'],
  },
});
