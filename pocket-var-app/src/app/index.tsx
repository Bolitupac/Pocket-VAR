import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, spacing, radius } from '../theme';
import { FloatingTabBar } from '../components/FloatingTabBar';

type BookmarkDef = {
  type: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
};

const BOOKMARKS: BookmarkDef[] = [
  { type: 'goal',        label: 'GOAL',    icon: 'target',         color: colors.goal },
  { type: 'foul',        label: 'FOUL',    icon: 'alert-circle',   color: colors.foul },
  { type: 'offside',     label: 'OFFSIDE', icon: 'flag-variant',   color: colors.offside },
  { type: 'yellow_card', label: 'YC',      icon: 'cards-outline',  color: colors.yellowCard },
  { type: 'red_card',    label: 'RC',      icon: 'cards-outline',  color: colors.redCard },
];

export default function CameraScreen() {
  return (
    <View style={styles.root}>

      {/* ── Top HUD bar ───────────────────────────── */}
      <View style={styles.hud}>
        <View style={styles.logoChip}>
          <Image
            source={require('../../assets/images/pocket-var-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.recPill}>
          <View style={styles.recDot} />
          <Text style={styles.recLabel}>REC</Text>
          <Text style={styles.recTimer}>00:00</Text>
        </View>

        <View style={styles.hudRight}>
          <View style={styles.hudBadge}>
            <Text style={styles.hudBadgeText}>FLASH OFF</Text>
          </View>
          <View style={[styles.hudBadge, { marginTop: 4 }]}>
            <Text style={styles.hudBadgeText}>1×</Text>
          </View>
        </View>
      </View>

      {/* ── Bookmark row ─────────────────────────── */}
      <View style={styles.bookmarkBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bookmarkScroll}
        >
          {BOOKMARKS.map((b) => (
            <TouchableOpacity
              key={b.type}
              style={styles.bmBtn}
              activeOpacity={0.65}
            >
              <MaterialCommunityIcons
                name={b.icon}
                size={16}
                color={colors.text}
              />
              <Text style={styles.bmLabel}>{b.label}</Text>
              <View style={[styles.bmIndicator, { backgroundColor: b.color }]} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Camera viewfinder ────────────────────── */}
      <View style={styles.viewfinder}>
        {/* Center placeholder */}
        <View style={styles.viewfinderCenter}>
          <MaterialCommunityIcons
            name="camera"
            size={48}
            color={colors.textDim}
          />
          <Text style={styles.viewHint}>Camera preview</Text>
          <Text style={styles.viewSub}>Tap record to start</Text>
        </View>
      </View>

      {/* ── Bottom dock ──────────────────────────── */}
      <View style={styles.dock}>
        <TouchableOpacity style={styles.dockBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="flash" size={22} color={colors.textSecondary} />
          <Text style={styles.dockBtnLabel}>FLASH</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.recBtn} activeOpacity={0.8}>
          <View style={styles.recBtnOuter}>
            <View style={styles.recBtnInner} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dockBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="folder-multiple" size={22} color={colors.textSecondary} />
          <Text style={styles.dockBtnLabel}>CLIPS</Text>
        </TouchableOpacity>
      </View>

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
  recPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 51, 85, 0.10)',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 51, 85, 0.20)',
    gap: 6,
  },
  recDot: {
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: colors.recording,
  },
  recLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.recording,
  },
  recTimer: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  hudRight: {
    alignItems: 'flex-end',
  },
  hudBadge: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hudBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: colors.textSecondary,
  },

  // ── Bookmark row
  bookmarkBar: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  bookmarkScroll: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  bmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.03)',
    gap: 6,
  },
  bmIndicator: {
    width: 3,
    height: 18,
    borderRadius: 2,
    marginLeft: 2,
  },
  bmLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: colors.text,
  },

  // ── Viewfinder
  viewfinder: {
    flex: 1,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  viewfinderCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  viewHint: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  viewSub: {
    fontSize: 12,
    color: colors.textDim,
    letterSpacing: 0.5,
  },

  // ── Bottom dock
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.sm,
    paddingBottom: spacing.md,
    marginBottom: 94,
  },
  dockBtn: {
    alignItems: 'center',
    gap: 4,
    width: 60,
  },
  dockBtnLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.textDim,
  },
  recBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recBtnOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: 'rgba(255, 51, 85, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recBtnInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.recording,
  },
});
