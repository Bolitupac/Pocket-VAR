import { useMemo, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, spacing, radius } from '../theme';
import { FloatingTabBar } from '../components/FloatingTabBar';

const MOCK_BOOKMARKS = [
  { type: 'goal',    position: 0.18, color: colors.goal },
  { type: 'foul',    position: 0.45, color: colors.foul },
  { type: 'offside', position: 0.72, color: colors.offside },
];

type ActiveTool = 'none' | 'slowmo' | 'draw' | 'zoom' | 'loop';

export default function ReviewScreen() {
  const [activeTool, setActiveTool] = useState<ActiveTool>('none');
  const [speed, setSpeed] = useState<number>(1);

  const waveBars = useMemo(
    () => Array.from({ length: 60 }, () => 8 + Math.random() * 28),
    [],
  );

  const toggleTool = (tool: ActiveTool) => {
    setActiveTool((prev) => (prev === tool ? 'none' : tool));
    if (tool === 'slowmo' && activeTool !== 'slowmo') setSpeed(0.5);
  };

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
            {/* Center play */}
            <View style={styles.playOverlay}>
              <View style={styles.playCircle}>
                <MaterialCommunityIcons name="play" size={24} color={colors.textSecondary} style={{ marginLeft: 3 }} />
              </View>
            </View>

            {/* Timestamp badge */}
            <View style={styles.timestampBadge}>
              <Text style={styles.timestampText}>-00:38</Text>
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
                          ? colors.textSecondary
                          : 'rgba(255,255,255,0.08)',
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
            <MaterialCommunityIcons name="skip-backward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.frameBtn} activeOpacity={0.7}>
            <MaterialCommunityIcons name="step-backward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.playBtn} activeOpacity={0.7}>
            <MaterialCommunityIcons name="play" size={24} color={colors.text} style={{ marginLeft: 2 }} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.frameBtn} activeOpacity={0.7}>
            <MaterialCommunityIcons name="step-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.frameBtn} activeOpacity={0.7}>
            <MaterialCommunityIcons name="skip-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.frameHint}>
          <Text style={styles.frameHintText}>1 FRAME = 33ms  ·  30fps</Text>
        </View>

        {/* ── VAR Tools ───────────────────────────── */}
        <View style={styles.toolsSection}>
          <View style={styles.toolsHeader}>
            <View style={styles.toolsHeaderLeft}>
              <View style={styles.toolsDot} />
              <Text style={styles.toolsTitle}>VAR TOOLS</Text>
            </View>
          </View>

          <View style={styles.toolsRow}>
            {/* Slow Motion */}
            <TouchableOpacity
              style={[styles.toolBtn, activeTool === 'slowmo' && styles.toolBtnActive]}
              onPress={() => toggleTool('slowmo')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="speedometer-slow"
                size={20}
                color={activeTool === 'slowmo' ? colors.text : colors.textSecondary}
              />
              <Text style={[styles.toolLabel, activeTool === 'slowmo' && styles.toolLabelActive]}>
                SLOW
              </Text>
            </TouchableOpacity>

            {/* Draw Line */}
            <TouchableOpacity
              style={[styles.toolBtn, activeTool === 'draw' && styles.toolBtnActive]}
              onPress={() => toggleTool('draw')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="ruler"
                size={20}
                color={activeTool === 'draw' ? colors.text : colors.textSecondary}
              />
              <Text style={[styles.toolLabel, activeTool === 'draw' && styles.toolLabelActive]}>
                DRAW
              </Text>
            </TouchableOpacity>

            {/* Zoom */}
            <TouchableOpacity
              style={[styles.toolBtn, activeTool === 'zoom' && styles.toolBtnActive]}
              onPress={() => toggleTool('zoom')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="magnify-plus"
                size={20}
                color={activeTool === 'zoom' ? colors.text : colors.textSecondary}
              />
              <Text style={[styles.toolLabel, activeTool === 'zoom' && styles.toolLabelActive]}>
                ZOOM
              </Text>
            </TouchableOpacity>

            {/* Loop */}
            <TouchableOpacity
              style={[styles.toolBtn, activeTool === 'loop' && styles.toolBtnActive]}
              onPress={() => toggleTool('loop')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="repeat"
                size={20}
                color={activeTool === 'loop' ? colors.text : colors.textSecondary}
              />
              <Text style={[styles.toolLabel, activeTool === 'loop' && styles.toolLabelActive]}>
                LOOP
              </Text>
            </TouchableOpacity>

            {/* Freeze Frame */}
            <TouchableOpacity style={styles.toolBtn} activeOpacity={0.7}>
              <MaterialCommunityIcons name="pause-circle" size={20} color={colors.textSecondary} />
              <Text style={styles.toolLabel}>FREEZE</Text>
            </TouchableOpacity>
          </View>

          {/* Speed selector — shown when SLOW-MO is active */}
          {activeTool === 'slowmo' && (
            <View style={styles.subToolPanel}>
              <Text style={styles.subToolTitle}>PLAYBACK SPEED</Text>
              <View style={styles.speedRow}>
                {[0.25, 0.5, 1, 2].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.speedChip, speed === s && styles.speedChipActive]}
                    onPress={() => setSpeed(s)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.speedText, speed === s && styles.speedTextActive]}>
                      {s}x
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Draw controls — shown when DRAW is active */}
          {activeTool === 'draw' && (
            <View style={styles.subToolPanel}>
              <Text style={styles.subToolTitle}>DRAW TOOL</Text>
              <View style={styles.drawRow}>
                <TouchableOpacity style={styles.drawActionBtn} activeOpacity={0.7}>
                  <MaterialCommunityIcons name="undo" size={16} color={colors.textSecondary} />
                  <Text style={styles.drawActionText}>Undo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.drawActionBtn} activeOpacity={0.7}>
                  <MaterialCommunityIcons name="delete" size={16} color={colors.textSecondary} />
                  <Text style={styles.drawActionText}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.drawActionBtn} activeOpacity={0.7}>
                  <MaterialCommunityIcons name="palette" size={16} color={colors.offside} />
                  <Text style={[styles.drawActionText, { color: colors.offside }]}>Yellow Line</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Zoom controls — shown when ZOOM is active */}
          {activeTool === 'zoom' && (
            <View style={styles.subToolPanel}>
              <Text style={styles.subToolTitle}>ZOOM LEVEL</Text>
              <View style={styles.speedRow}>
                {[1.5, 2, 3, 4].map((z) => (
                  <TouchableOpacity
                    key={z}
                    style={[styles.speedChip, speed === z && styles.speedChipActive]}
                    onPress={() => setSpeed(z)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.speedText, speed === z && styles.speedTextActive]}>
                      {z}x
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Loop controls — shown when LOOP is active */}
          {activeTool === 'loop' && (
            <View style={styles.subToolPanel}>
              <Text style={styles.subToolTitle}>LOOP SEGMENT</Text>
              <View style={styles.loopRow}>
                <TouchableOpacity style={styles.loopActionBtn} activeOpacity={0.7}>
                  <MaterialCommunityIcons name="flag" size={14} color={colors.offside} />
                  <Text style={styles.loopActionText}>Set In Point</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loopActionBtn} activeOpacity={0.7}>
                  <MaterialCommunityIcons name="flag-checkered" size={14} color={colors.goal} />
                  <Text style={styles.loopActionText}>Set Out Point</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* ── Decision buttons ────────────────────── */}
        <View style={styles.decisions}>
          <TouchableOpacity style={[styles.decisionBtn, styles.decisionNeutral]} activeOpacity={0.7}>
            <MaterialCommunityIcons name="close" size={18} color={colors.textSecondary} />
            <Text style={styles.decisionLabel}>NO FOUL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.decisionBtn, styles.decisionFoul]} activeOpacity={0.7}>
            <MaterialCommunityIcons name="alert-circle" size={18} color={colors.foul} />
            <Text style={[styles.decisionLabel, { color: colors.foul }]}>MARK FOUL</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveClipBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="content-save" size={18} color={colors.text} />
          <Text style={styles.saveClipLabel}>SAVE CLIP</Text>
        </TouchableOpacity>

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
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
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
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timestampBadge: {
    position: 'absolute',
    bottom: 10,
    left: 14,
    backgroundColor: 'rgba(0,0,0,0.60)',
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

  // ── Timeline
  timelineSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.textSecondary,
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
    backgroundColor: '#FFFFFF',
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
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
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

  // ── VAR Tools
  toolsSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  toolsHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  toolsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toolsDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
  },
  toolsTitle: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: colors.textSecondary,
  },
  toolsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  toolBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255,255,255,0.02)',
    gap: 4,
  },
  toolBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  toolLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.textDim,
  },
  toolLabelActive: {
    color: colors.text,
  },

  // ── Sub-tool panels
  subToolPanel: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  subToolTitle: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.textDim,
  },
  speedRow: {
    flexDirection: 'row',
    gap: 8,
  },
  speedChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  speedChipActive: {
    borderColor: 'rgba(255, 255, 255, 0.30)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  speedText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textDim,
    fontVariant: ['tabular-nums'],
  },
  speedTextActive: {
    color: colors.text,
  },

  // Draw controls
  drawRow: {
    flexDirection: 'row',
    gap: 8,
  },
  drawActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.03)',
    gap: 5,
  },
  drawActionText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  // Loop controls
  loopRow: {
    flexDirection: 'row',
    gap: 8,
  },
  loopActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.03)',
    gap: 5,
  },
  loopActionText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
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
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: colors.border,
  },
  decisionFoul: {
    backgroundColor: 'rgba(249, 115, 22, 0.08)',
    borderColor: 'rgba(249, 115, 22, 0.22)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  saveClipLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: colors.text,
  },
});
