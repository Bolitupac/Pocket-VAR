import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { FloatingTabBar } from '../components/FloatingTabBar';

type Clip = {
  id: string;
  label: string;
  matchTime: string;
  duration: string;
  date: string;
  tag: string;
  color: string;
};

const MOCK_CLIPS: Clip[] = [
  { id: '1', label: 'Goal — Right Foot',  matchTime: '02:14', duration: '12s', date: 'Jun 8', tag: 'GOAL',    color: colors.goal },
  { id: '2', label: 'Shirt Pull Foul',     matchTime: '18:42', duration: '8s',  date: 'Jun 8', tag: 'FOUL',    color: colors.foul },
  { id: '3', label: 'Tight Offside Call',  matchTime: '33:07', duration: '10s', date: 'Jun 8', tag: 'OFFSIDE', color: colors.offside },
  { id: '4', label: 'Goal — Header',       matchTime: '51:29', duration: '9s',  date: 'Jun 8', tag: 'GOAL',    color: colors.goal },
  { id: '5', label: 'Reckless Challenge',  matchTime: '67:55', duration: '7s',  date: 'Jun 8', tag: 'YC',      color: colors.yellowCard },
  { id: '6', label: 'Violent Conduct',     matchTime: '78:01', duration: '11s', date: 'Jun 8', tag: 'RC',      color: colors.redCard },
];

export default function ClipsScreen() {
  return (
    <View style={styles.root}>

      {/* ── Top HUD ─────────────────────────────── */}
      <View style={styles.hud}>
        <View style={styles.logoChip}>
          <Image
            source={require('../../assets/images/pocket-var-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.hudCenter}>
          <Text style={styles.hudTitle}>SAVED CLIPS</Text>
          <Text style={styles.hudSub}>VIDEO EVIDENCE LIBRARY</Text>
        </View>

        <View style={styles.countBadge}>
          <Text style={styles.countNum}>{MOCK_CLIPS.length}</Text>
          <Text style={styles.countLabel}>CLIPS</Text>
        </View>
      </View>

      {/* ── Filter row ──────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
      >
        {[
          { label: 'ALL',     color: colors.primary },
          { label: 'GOAL',    color: colors.goal },
          { label: 'FOUL',    color: colors.foul },
          { label: 'OFFSIDE', color: colors.offside },
          { label: 'YC',      color: colors.yellowCard },
          { label: 'RC',      color: colors.redCard },
        ].map((f, i) => (
          <TouchableOpacity
            key={f.label}
            style={[
              styles.filterChip,
              i === 0 && { backgroundColor: 'rgba(34, 197, 94, 0.12)', borderColor: colors.primary },
            ]}
            activeOpacity={0.7}
          >
            <View style={[styles.filterDot, { backgroundColor: f.color }]} />
            <Text style={[styles.filterLabel, i === 0 && { color: colors.primary }]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Clips Grid ──────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_CLIPS.map((clip) => (
          <TouchableOpacity key={clip.id} style={styles.card} activeOpacity={0.80}>

            {/* Thumbnail */}
            <View style={styles.thumb}>
              {/* Color accent top bar */}
              <View style={[styles.accentBar, { backgroundColor: clip.color }]} />

              {/* Corner brackets */}
              <View style={[styles.corner, styles.cTL, { borderColor: clip.color }]} />
              <View style={[styles.corner, styles.cTR, { borderColor: clip.color }]} />
              <View style={[styles.corner, styles.cBL, { borderColor: clip.color }]} />
              <View style={[styles.corner, styles.cBR, { borderColor: clip.color }]} />

              {/* Play button */}
              <View style={styles.playCircle}>
                <Text style={styles.playIcon}>▶</Text>
              </View>

              {/* Duration badge */}
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{clip.duration}</Text>
              </View>

              {/* Type badge */}
              <View style={[styles.typeBadge, { backgroundColor: `${clip.color}22`, borderColor: clip.color }]}>
                <Text style={[styles.typeText, { color: clip.color }]}>{clip.tag}</Text>
              </View>
            </View>

            {/* Card meta */}
            <View style={styles.meta}>
              <Text style={styles.metaLabel} numberOfLines={1}>{clip.label}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaTime}>{clip.matchTime}</Text>
                <Text style={styles.metaDate}>{clip.date}</Text>
              </View>
            </View>

          </TouchableOpacity>
        ))}
      </ScrollView>

      <FloatingTabBar />
    </View>
  );
}

const C = 11;
const B = 1.5;

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
    paddingTop: spacing.xxxl + spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: 'rgba(3, 8, 3, 0.88)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(34, 197, 94, 0.10)',
  },
  logoChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    width: 62,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 58,
    height: 36,
  },
  hudCenter: {
    alignItems: 'center',
    gap: 1,
  },
  hudTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: colors.text,
  },
  hudSub: {
    fontSize: 7.5,
    fontWeight: '600',
    letterSpacing: 1.8,
    color: colors.textDim,
  },
  countBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.10)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.22)',
    minWidth: 44,
  },
  countNum: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary,
    lineHeight: 18,
  },
  countLabel: {
    fontSize: 7,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.textDim,
  },

  // ── Filter row
  filterRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(34, 197, 94, 0.06)',
    maxHeight: 46,
  },
  filterContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    gap: 5,
  },
  filterDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  filterLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.textDim,
  },

  // ── Grid
  scroll: { flex: 1 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 108,
    gap: spacing.md,
  },

  // ── Card
  card: {
    width: '47.5%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.10)',
    overflow: 'hidden',
  },

  // Thumbnail
  thumb: {
    height: 96,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 2,
    opacity: 0.7,
  },
  corner: {
    position: 'absolute',
    width: C,
    height: C,
  },
  cTL: { top: 8, left: 8,   borderTopWidth: B,    borderLeftWidth: B,   borderTopLeftRadius: 3 },
  cTR: { top: 8, right: 8,  borderTopWidth: B,    borderRightWidth: B,  borderTopRightRadius: 3 },
  cBL: { bottom: 8, left: 8,  borderBottomWidth: B, borderLeftWidth: B,   borderBottomLeftRadius: 3 },
  cBR: { bottom: 8, right: 8, borderBottomWidth: B, borderRightWidth: B,  borderBottomRightRadius: 3 },
  playCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.70)',
    marginLeft: 2,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 7,
    right: 7,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  durationText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
  },
  typeBadge: {
    position: 'absolute',
    top: 7,
    right: 7,
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  typeText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // Card meta
  meta: {
    paddingHorizontal: spacing.sm + 2,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm + 2,
    gap: 5,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaTime: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  metaDate: {
    fontSize: 9,
    fontWeight: '500',
    color: colors.textDim,
    letterSpacing: 0.3,
  },
});
