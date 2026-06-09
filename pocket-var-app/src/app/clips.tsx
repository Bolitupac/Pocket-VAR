import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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
          { label: 'ALL',     color: colors.text },
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
              i === 0 && styles.filterChipActive,
            ]}
            activeOpacity={0.7}
          >
            {f.label !== 'ALL' && (
              <View style={[styles.filterDot, { backgroundColor: f.color }]} />
            )}
            <Text style={[styles.filterLabel, i === 0 && styles.filterLabelActive]}>
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
              <View style={styles.playCircle}>
                <MaterialCommunityIcons name="play" size={16} color="rgba(255,255,255,0.60)" style={{ marginLeft: 1 }} />
              </View>

              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{clip.duration}</Text>
              </View>

              <View style={[styles.typeBadge, { backgroundColor: `${clip.color}18`, borderColor: clip.color }]}>
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
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
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
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 44,
  },
  countNum: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
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
    borderBottomColor: colors.divider,
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
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.02)',
    gap: 5,
  },
  filterChipActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
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
  filterLabelActive: {
    color: colors.text,
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
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
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
  playCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 7,
    right: 7,
    backgroundColor: 'rgba(0,0,0,0.60)',
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
