import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { FloatingTabBar } from '../components/FloatingTabBar';

type BookmarkDef = {
  type: string;
  label: string;
  icon: string;
  color: string;
};

const BOOKMARKS: BookmarkDef[] = [
  { type: 'goal',        label: 'GOAL',    icon: '⚽', color: colors.goal },
  { type: 'foul',        label: 'FOUL',    icon: '⚠',  color: colors.foul },
  { type: 'offside',     label: 'OFFSIDE', icon: '🚩', color: colors.offside },
  { type: 'yellow_card', label: 'YC',      icon: '🟨', color: colors.yellowCard },
  { type: 'red_card',    label: 'RC',      icon: '🟥', color: colors.redCard },
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
            <Text style={styles.hudBadgeText}>⚡ OFF</Text>
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
              style={[styles.bmBtn, { borderColor: b.color }]}
              activeOpacity={0.65}
            >
              <View style={[styles.bmDot, { backgroundColor: b.color }]} />
              <Text style={styles.bmIcon}>{b.icon}</Text>
              <Text style={[styles.bmLabel, { color: b.color }]}>{b.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Camera viewfinder ────────────────────── */}
      <View style={styles.viewfinder}>

        {/* Rule-of-thirds grid */}
        <View style={styles.gridH1} />
        <View style={styles.gridH2} />
        <View style={styles.gridV1} />
        <View style={styles.gridV2} />

        {/* Crosshair */}
        <View style={styles.crossH} />
        <View style={styles.crossV} />
        <View style={styles.crossDot} />

        {/* Corner brackets */}
        <View style={[styles.corner, styles.cTL]} />
        <View style={[styles.corner, styles.cTR]} />
        <View style={[styles.corner, styles.cBL]} />
        <View style={[styles.corner, styles.cBR]} />

        {/* Status overlays */}
        <View style={styles.liveTag}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <View style={styles.qualityTag}>
          <Text style={styles.qualityText}>1080p</Text>
        </View>

        {/* Center content */}
        <View style={styles.viewfinderCenter}>
          <Text style={styles.camIcon}>◎</Text>
          <Text style={styles.viewHint}>Camera preview will render here</Text>
          <Text style={styles.viewSub}>expo-camera · H.264</Text>
        </View>

        {/* VAR monitor watermark */}
        <View style={styles.watermark}>
          <Image
            source={require('../../assets/images/varlogo.png')}
            style={styles.watermarkImg}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* ── Bottom dock ──────────────────────────── */}
      <View style={styles.dock}>
        <TouchableOpacity style={styles.dockBtn} activeOpacity={0.7}>
          <Text style={styles.dockBtnIcon}>⚡</Text>
          <Text style={styles.dockBtnLabel}>FLASH</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.recBtn} activeOpacity={0.8}>
          <View style={styles.recBtnOuter}>
            <View style={styles.recBtnInner} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dockBtn} activeOpacity={0.7}>
          <Text style={styles.dockBtnIcon}>⊞</Text>
          <Text style={styles.dockBtnLabel}>CLIPS</Text>
        </TouchableOpacity>
      </View>

      <FloatingTabBar />
    </View>
  );
}

const C = 20;
const B = 2.5;

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
  recPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 51, 85, 0.12)',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 51, 85, 0.28)',
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
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  hudBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: colors.textSecondary,
  },

  // ── Bookmark row
  bookmarkBar: {
    backgroundColor: 'rgba(3, 8, 3, 0.80)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(34, 197, 94, 0.08)',
  },
  bookmarkScroll: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  bmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    gap: 5,
  },
  bmDot: {
    width: 5,
    height: 5,
    borderRadius: 99,
  },
  bmIcon: {
    fontSize: 13,
  },
  bmLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
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
    borderColor: 'rgba(34, 197, 94, 0.12)',
    overflow: 'hidden',
  },

  // Grid lines (rule of thirds)
  gridH1: {
    position: 'absolute', left: 0, right: 0,
    top: '33%', height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
  },
  gridH2: {
    position: 'absolute', left: 0, right: 0,
    top: '66%', height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
  },
  gridV1: {
    position: 'absolute', top: 0, bottom: 0,
    left: '33%', width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
  },
  gridV2: {
    position: 'absolute', top: 0, bottom: 0,
    left: '66%', width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
  },

  // Crosshair
  crossH: {
    position: 'absolute',
    top: '50%', left: '40%', right: '40%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(34, 197, 94, 0.40)',
  },
  crossV: {
    position: 'absolute',
    left: '50%', top: '40%', bottom: '40%',
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(34, 197, 94, 0.40)',
  },
  crossDot: {
    position: 'absolute',
    top: '50%', left: '50%',
    width: 6, height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    transform: [{ translateX: -3 }, { translateY: -3 }],
    opacity: 0.7,
  },

  // Corner brackets
  corner: {
    position: 'absolute',
    width: C,
    height: C,
    borderColor: colors.primary,
  },
  cTL: { top: 14, left: 14,   borderTopWidth: B, borderLeftWidth: B,   borderTopLeftRadius: 5 },
  cTR: { top: 14, right: 14,  borderTopWidth: B, borderRightWidth: B,  borderTopRightRadius: 5 },
  cBL: { bottom: 14, left: 14,  borderBottomWidth: B, borderLeftWidth: B,   borderBottomLeftRadius: 5 },
  cBR: { bottom: 14, right: 14, borderBottomWidth: B, borderRightWidth: B,  borderBottomRightRadius: 5 },

  // LIVE tag
  liveTag: {
    position: 'absolute',
    top: 14, left: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 51, 85, 0.14)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 51, 85, 0.30)',
    gap: 4,
  },
  liveDot: {
    width: 5, height: 5,
    borderRadius: 3,
    backgroundColor: colors.recording,
  },
  liveText: {
    fontSize: 9, fontWeight: '800', letterSpacing: 1.5,
    color: colors.recording,
  },

  // Quality tag
  qualityTag: {
    position: 'absolute',
    top: 14, right: 44,
    backgroundColor: 'rgba(34, 197, 94, 0.10)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.20)',
  },
  qualityText: {
    fontSize: 9, fontWeight: '700', letterSpacing: 0.8,
    color: colors.primary,
  },

  // Viewfinder center
  viewfinderCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  camIcon: {
    fontSize: 44,
    color: colors.textDim,
    opacity: 0.5,
  },
  viewHint: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  viewSub: {
    fontSize: 11,
    color: colors.textDim,
    letterSpacing: 0.5,
  },

  // Watermark
  watermark: {
    position: 'absolute',
    bottom: 22,
    right: 22,
    opacity: 0.08,
    backgroundColor: 'transparent',
  },
  watermarkImg: {
    width: 60,
    height: 60,
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
  dockBtnIcon: {
    fontSize: 20,
    color: colors.textSecondary,
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
