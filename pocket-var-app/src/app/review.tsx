import { useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { FloatingTabBar } from '../components/FloatingTabBar';

const MOCK_BOOKMARKS = [
  { type: 'goal',    position: 0.18, color: colors.goal },
  { type: 'foul',    position: 0.45, color: colors.foul },
  { type: 'offside', position: 0.72, color: colors.offside },
];

export default function ReviewScreen() {
  const waveBars = useMemo(
    () => Array.from({ length: 60 }, () => 8 + Math.random() * 28),
    [],
  );

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
          <Text style={styles.hudTitle}>VAR REVIEW</Text>
          <Text style={styles.hudSub}>LAST 60 SECONDS</Text>
        </View>

        <View style={styles.hudBadge}>
          <View style={styles.hudBadgeDot} />
          <Text style={styles.hudBadgeText}>60s</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Video area ──────────────────────────── */}
        <View style={styles.videoWrap}>
          <View style={styles.videoArea}>
            {/* Corner brackets */}
            <View style={[styles.corner, styles.cTL]} />
            <View style={[styles.corner, styles.cTR]} />
            <View style={[styles.corner, styles.cBL]} />
            <View style={[styles.corner, styles.cBR]} />

            {/* Scan line overlay */}
            <View style={styles.scanLine} />

            {/* Center play */}
            <View style={styles.playOverlay}>
              <View style={styles.playCircle}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
            </View>

            {/* Timestamp badge */}
            <View style={styles.timestampBadge}>
              <Text style={styles.timestampText}>-00:38</Text>
            </View>

            {/* VAR watermark */}
            <View style={styles.varWatermark}>
              <Text style={styles.varWatermarkText}>VAR</Text>
            </View>
          </View>
        </View>

        {/* ── Timeline ────────────────────────────── */}
        <View style={styles.timelineSection}>
          <View style={styles.timelineHeader}>
            <Text style={styles.timelineTitle}>TIMELINE</Text>
            <View style={styles.timelineLegend}>
              {MOCK_BOOKMARKS.map((b, i) => (
                <View key={i} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: b.color }]} />
                  <Text style={styles.legendText}>{b.type.toUpperCase()}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.waveformContainer}>
            {/* Waveform bars */}
            <View style={styles.waveform}>
              {waveBars.map((h, i) => {
                const pos = i / waveBars.length;
                const isPlayed = pos < 0.55;
                return (
                  <View
                    key={i}
                    style={[
                      styles.waveBar,
                      {
                        height: h,
                        backgroundColor: isPlayed
                          ? `rgba(34, 197, 94, 0.65)`
                          : `rgba(34, 197, 94, 0.18)`,
                      },
                    ]}
                  />
                );
              })}
            </View>

            {/* Bookmark dots */}
            {MOCK_BOOKMARKS.map((b, i) => (
              <View
                key={i}
                style={[
                  styles.bookmarkDot,
                  { left: `${b.position * 100}%` as any, backgroundColor: b.color },
                ]}
              />
            ))}

            {/* Playhead */}
            <View style={styles.playhead} />
          </View>

          <View style={styles.timeLabels}>
            <Text style={styles.timeLabel}>-60s</Text>
            <Text style={styles.timeLabel}>-45s</Text>
            <Text style={styles.timeLabel}>-30s</Text>
            <Text style={styles.timeLabel}>-15s</Text>
            <Text style={styles.timeLabel}>NOW</Text>
          </View>
        </View>

        {/* ── Frame controls ──────────────────────── */}
        <View style={styles.frameControls}>
          <TouchableOpacity style={styles.frameBtn} activeOpacity={0.7}>
            <Text style={styles.frameBtnIcon}>⏮</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.frameBtn} activeOpacity={0.7}>
            <Text style={styles.frameBtnIcon}>⏪</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playBtn} activeOpacity={0.7}>
            <Text style={styles.playBtnIcon}>▶</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.frameBtn} activeOpacity={0.7}>
            <Text style={styles.frameBtnIcon}>⏩</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.frameBtn} activeOpacity={0.7}>
            <Text style={styles.frameBtnIcon}>⏭</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.frameHint}>
          <Text style={styles.frameHintText}>1 FRAME = 33ms  ·  30fps</Text>
        </View>

        {/* ── Decision buttons ────────────────────── */}
        <View style={styles.decisions}>
          <TouchableOpacity style={[styles.decisionBtn, styles.decisionNeutral]} activeOpacity={0.7}>
            <Text style={styles.decisionIcon}>✕</Text>
            <Text style={styles.decisionLabel}>NO FOUL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.decisionBtn, styles.decisionFoul]} activeOpacity={0.7}>
            <Text style={styles.decisionIcon}>⚠</Text>
            <Text style={[styles.decisionLabel, { color: colors.foul }]}>MARK FOUL</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveClipBtn} activeOpacity={0.7}>
          <Text style={styles.saveClipIcon}>💾</Text>
          <Text style={styles.saveClipLabel}>SAVE CLIP</Text>
        </TouchableOpacity>

      </ScrollView>

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
  hudCenter: {
    alignItems: 'center',
    gap: 1,
  },
  hudTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: colors.text,
  },
  hudSub: {
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 2,
    color: colors.textDim,
  },
  hudBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.10)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.22)',
    gap: 5,
  },
  hudBadgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  hudBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },

  scroll: { flex: 1 },
  scrollContent: {
    paddingBottom: 110,
  },

  // ── Video
  videoWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  videoArea: {
    aspectRatio: 16 / 9,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.12)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: C,
    height: C,
    borderColor: colors.primary,
  },
  cTL: { top: 10, left: 10,   borderTopWidth: B, borderLeftWidth: B,   borderTopLeftRadius: 5 },
  cTR: { top: 10, right: 10,  borderTopWidth: B, borderRightWidth: B,  borderTopRightRadius: 5 },
  cBL: { bottom: 10, left: 10,  borderBottomWidth: B, borderLeftWidth: B,   borderBottomLeftRadius: 5 },
  cBR: { bottom: 10, right: 10, borderBottomWidth: B, borderRightWidth: B,  borderBottomRightRadius: 5 },
  scanLine: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
  },
  playOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(34, 197, 94, 0.14)',
    borderWidth: 1.5,
    borderColor: 'rgba(34, 197, 94, 0.40)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 20,
    color: colors.primary,
    marginLeft: 3,
  },
  timestampBadge: {
    position: 'absolute',
    bottom: 10,
    left: 14,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  timestampText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  varWatermark: {
    position: 'absolute',
    bottom: 10,
    right: 14,
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.15)',
  },
  varWatermarkText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    color: 'rgba(34,197,94,0.50)',
  },

  // ── Timeline
  timelineSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.10)',
    padding: spacing.md,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  timelineTitle: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.primary,
  },
  timelineLegend: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: colors.textDim,
  },
  waveformContainer: {
    height: 48,
    position: 'relative',
    marginBottom: 4,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 44,
    gap: 1,
  },
  waveBar: {
    flex: 1,
    borderRadius: 1,
    minHeight: 3,
  },
  bookmarkDot: {
    position: 'absolute',
    bottom: -2,
    width: 7,
    height: 7,
    borderRadius: 4,
    marginLeft: -3.5,
    borderWidth: 1,
    borderColor: colors.background,
  },
  playhead: {
    position: 'absolute',
    left: '55%',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timeLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: colors.textDim,
  },

  // ── Frame controls
  frameControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.md,
  },
  frameBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameBtnIcon: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  playBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(34, 197, 94, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnIcon: {
    fontSize: 20,
    color: colors.primary,
    marginLeft: 2,
  },
  frameHint: {
    alignItems: 'center',
    marginTop: 6,
  },
  frameHintText: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: colors.textDim,
  },

  // ── Decision buttons
  decisions: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  decisionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 6,
  },
  decisionNeutral: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.10)',
  },
  decisionFoul: {
    backgroundColor: 'rgba(249, 115, 22, 0.10)',
    borderColor: 'rgba(249, 115, 22, 0.28)',
  },
  decisionIcon: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  decisionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: colors.textSecondary,
  },

  saveClipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    paddingVertical: 14,
    borderRadius: radius.md,
    backgroundColor: 'rgba(34, 197, 94, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.28)',
    gap: 8,
  },
  saveClipIcon: {
    fontSize: 16,
  },
  saveClipLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: colors.primary,
  },
});
