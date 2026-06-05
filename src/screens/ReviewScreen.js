import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing, typography, borderRadius } from '../theme';

// ─── Timeline Waveform ─────────────────────────────────────
function TimelineWave({ height = 80, width = '100%' }) {
  return (
    <View style={[styles.timelineBar, { height }]}>
      {/* Placeholder waveform bars */}
      {Array.from({ length: 60 }).map((_, i) => {
        const barHeight = 20 + Math.random() * 40;
        const isActive = i > 45;
        return (
          <View
            key={i}
            style={[
              styles.timelineBarSegment,
              {
                height: barHeight,
                backgroundColor: isActive ? colors.primary : colors.textDim,
                opacity: isActive ? 1 : 0.4,
              },
            ]}
          />
        );
      })}
      {/* Position indicator */}
      <View style={styles.positionIndicator} />
    </View>
  );
}

// ─── Review Screen ─────────────────────────────────────────
export default function ReviewScreen() {
  const [playheadPosition, setPlayheadPosition] = useState(58);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Video Preview Area */}
        <View style={styles.videoPreview}>
          <View style={styles.videoPlaceholder}>
            <Svg width={60} height={60} viewBox="0 0 100 100" fill="none">
              <Path
                d="M50 5 L90 20 L90 50 C90 75 70 92 50 97 C30 92 10 75 10 50 L10 20 Z"
                stroke={colors.primary}
                strokeWidth={3}
                fill={colors.primaryDim}
              />
            </Svg>
            <Text style={[typography.bodySmall, { marginTop: 12 }]}>
              Last 60 seconds will appear here
            </Text>
          </View>

          {/* Timestamp overlay */}
          <View style={styles.timeOverlay}>
            <Text style={styles.timeText}>-00:{String(60 - playheadPosition).padStart(2, '0')}</Text>
          </View>
        </View>

        {/* Timeline Scrubber */}
        <View style={styles.timelineSection}>
          <Text style={[typography.caption, { marginBottom: 8 }]}>TIMELINE (last 60s)</Text>
          <TimelineWave height={80} />

          {/* Time labels */}
          <View style={styles.timeLabels}>
            <Text style={styles.timeLabel}>-60s</Text>
            <Text style={styles.timeLabel}>-30s</Text>
            <Text style={styles.timeLabel}>NOW</Text>
          </View>
        </View>

        {/* Frame Stepping Controls */}
        <View style={styles.frameControls}>
          <TouchableOpacity style={styles.frameBtn}>
            <Text style={styles.frameBtnText}>⏪</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.playBtn, isPlaying && { borderColor: colors.primary }]}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            <Text style={styles.playBtnText}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.frameBtn}>
            <Text style={styles.frameBtnText}>⏩</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <ActionButton label="MARK FOUL" color={colors.foul} icon="⚠" />
          <ActionButton label="NO FOUL" color={colors.goal} icon="✓" />
        </View>
        <View style={styles.actionRow}>
          <ActionButton label="SAVE CLIP" color={colors.primary} icon="💾" />
          <ActionButton label="CANCEL" color={colors.textDim} icon="✕" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionButton({ label, color, icon }) {
  return (
    <TouchableOpacity style={[styles.actionBtn, { borderColor: color }]} activeOpacity={0.7}>
      <Text style={[styles.actionBtnText, { color }]}>{icon}  {label}</Text>
    </TouchableOpacity>
  );
}

// ─── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 40,
  },

  // Video Preview
  videoPreview: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  timeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },

  // Timeline
  timelineSection: {
    marginTop: spacing.xxl,
  },
  timelineBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  timelineBarSegment: {
    flex: 1,
    borderRadius: 2,
  },
  positionIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.primary,
    right: '5%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '500',
  },

  // Frame Controls
  frameControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginTop: spacing.xl,
  },
  frameBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameBtnText: {
    fontSize: 20,
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.textDim,
  },
  playBtnText: {
    fontSize: 24,
  },

  // Actions
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  actionBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
