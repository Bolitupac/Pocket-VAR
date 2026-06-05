import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  PanResponder,
  AppState,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, typography, borderRadius } from '../theme';
import useAppStore from '../store/useAppStore';
import * as FileSystem from 'expo-file-system';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TIMELINE_PADDING = 20;
const TIMELINE_WIDTH = SCREEN_WIDTH - TIMELINE_PADDING * 2;
const FRAME_DURATION = 0.033; // ~1 frame at 30fps
const MAX_REVIEW_WINDOW = 60;

// ─── Format time ──────────────────────────────────────────
const fmt = (s) => {
  const m = Math.floor(Math.abs(s) / 60);
  const sec = Math.abs(s) % 60;
  const sign = s < 0 ? '-' : '';
  return `${sign}${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

// ─── Bookmark marker colors ───────────────────────────────
const BM_COLORS = {
  goal: '#00FF88',
  foul: '#FF6600',
  offside: '#FFD700',
  yellow_card: '#FFD700',
  red_card: '#FF3355',
};

// ─── Bookmark Dot ─────────────────────────────────────────
function BookmarkDot({ color, left }) {
  return (
    <View
      style={[
        styles.bmDot,
        {
          left: Math.max(2, Math.min(left, TIMELINE_WIDTH - 8)),
          backgroundColor: color,
          shadowColor: color,
        },
      ]}
    />
  );
}

// ─── Review Screen ────────────────────────────────────────
export default function ReviewScreen() {
  const navigation = useNavigation();
  const { bookmarks, currentMatchId, currentVideoPath } = useAppStore();
  const [videoSource, setVideoSource] = useState(null);
  const [status, setStatus] = useState({ isPlaying: false, currentTime: 0, duration: 0 });
  const [windowStart, setWindowStart] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubPosition, setScrubPosition] = useState(0);

  // ── Determine video path ───────────────────────────────
  useEffect(() => {
    (async () => {
      let path = currentVideoPath;
      if (!path && currentMatchId) {
        const p = `${FileSystem.documentDirectory}matches/${currentMatchId}/recording.mp4`;
        const info = await FileSystem.getInfoAsync(p);
        if (info.exists) path = p;
      }
      if (path) setVideoSource(path);
    })();
  }, [currentMatchId, currentVideoPath]);

  // Get relevant bookmarks for the current review window
  const windowBookmarks = bookmarks
    .filter((b) => b.matchId === currentMatchId)
    .map((b) => ({
      ...b,
      relativePos: status.duration > 0
        ? ((b.timestampSeconds - windowStart) / Math.min(status.duration - windowStart, MAX_REVIEW_WINDOW)) * TIMELINE_WIDTH
        : 0,
    }));

  // ── Timeline scrubber ──────────────────────────────────
  const timelineRef = useRef(null);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsScrubbing(true);
        const x = evt.nativeEvent.locationX;
        setScrubPosition(Math.max(0, Math.min(x, TIMELINE_WIDTH)));
      },
      onPanResponderMove: (evt) => {
        const x = evt.nativeEvent.locationX;
        setScrubPosition(Math.max(0, Math.min(x, TIMELINE_WIDTH)));
      },
      onPanResponderRelease: () => {
        setIsScrubbing(false);
      },
    })
  ).current;

  // Update video position when scrubbing
  useEffect(() => {
    if (!isScrubbing || !status.duration) return;
    const seekTarget = windowStart + (scrubPosition / TIMELINE_WIDTH) * Math.min(status.duration - windowStart, MAX_REVIEW_WINDOW);
    playerRef.current?.seekTo(seekTarget);
  }, [scrubPosition, isScrubbing]);

  // ── Video player ref ───────────────────────────────────
  const playerRef = useRef(null);

  const handleStatusUpdate = useCallback((s) => {
    setStatus((prev) => ({
      ...prev,
      isPlaying: s.playing ?? false,
      currentTime: s.currentTime ?? 0,
      duration: s.duration ?? 0,
    }));
  }, []);

  // Calculate window start (last 60s of recording)
  useEffect(() => {
    if (status.duration > MAX_REVIEW_WINDOW) {
      setWindowStart(status.duration - MAX_REVIEW_WINDOW);
    } else {
      setWindowStart(0);
    }
  }, [status.duration]);

  // ── Action: Mark Foul / No Foul ───────────────────────
  const handleMarkFoul = () => {
    // In Checkpoint 4, this will save to SQLite + export clip
    navigation.goBack();
  };

  const handleNoFoul = () => {
    navigation.goBack();
  };

  // ── Empty State ────────────────────────────────────────
  if (!videoSource) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🎥</Text>
          <Text style={[typography.h3, { marginTop: 16 }]}>No Recording</Text>
          <Text style={[typography.bodySmall, { textAlign: 'center', marginTop: 8, paddingHorizontal: 40 }]}>
            Record a match first, then come here to review the last 60 seconds.
          </Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={[typography.button, { color: colors.background }]}>Back to Camera</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const windowDuration = Math.min(status.duration - windowStart, MAX_REVIEW_WINDOW);
  const currentWindowTime = Math.max(0, status.currentTime - windowStart);
  const playheadPercent = windowDuration > 0 ? (currentWindowTime / windowDuration) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Video Player */}
      <View style={styles.videoContainer}>
        {videoSource && (
          <VideoView
            ref={playerRef}
            style={styles.video}
            source={{ uri: videoSource }}
            onStatusUpdate={handleStatusUpdate}
            useNativeControls={false}
            nativeControls={false}
          />
        )}

        {/* Time overlay */}
        <View style={styles.timeOverlay}>
          <Text style={styles.timeText}>
            {fmt(status.currentTime - status.duration)} / {fmt(status.duration)}
          </Text>
        </View>

        {/* Play/Pause big button overlay */}
        {!status.isPlaying && (
          <TouchableOpacity style={styles.playOverlay} onPress={() => playerRef.current?.play()}>
            <View style={styles.bigPlayBtn}>
              <Text style={styles.bigPlayIcon}>▶</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Timeline Section */}
      <View style={styles.timelineSection}>
        <Text style={[typography.caption, { marginBottom: 8, color: colors.textSecondary }]}>
          LAST {MAX_REVIEW_WINDOW}s
        </Text>

        {/* Timeline bar */}
        <View
          style={styles.timelineOuter}
          ref={timelineRef}
          {...panResponder.panHandlers}
        >
          {/* Background waveform bars */}
          <View style={styles.timelineTrack}>
            {Array.from({ length: 60 }).map((_, i) => {
              const barH = 16 + Math.random() * 32;
              const isPast = i / 60 <= playheadPercent / 100;
              return (
                <View
                  key={i}
                  style={[
                    styles.timelineBar,
                    {
                      height: barH,
                      backgroundColor: isPast ? colors.primary : colors.textDim,
                      opacity: isPast ? 0.9 : 0.25,
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Bookmark markers */}
          {windowBookmarks.map((bm) => (
            <BookmarkDot key={bm.id} color={BM_COLORS[bm.type] || colors.primary} left={bm.relativePos} />
          ))}

          {/* Playhead indicator */}
          <View style={[styles.playhead, { left: `${playheadPercent}%` }]} />
        </View>

        {/* Time labels */}
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>-{fmt(windowDuration)}</Text>
          <Text style={styles.timeLabel}>-{fmt(Math.floor(windowDuration / 2))}</Text>
          <Text style={[styles.timeLabel, { color: colors.primary }]}>NOW</Text>
        </View>
      </View>

      {/* Frame Controls */}
      <View style={styles.frameControls}>
        <TouchableOpacity
          style={styles.frameBtn}
          onPress={() => {
            const t = Math.max(windowStart, status.currentTime - FRAME_DURATION);
            playerRef.current?.seekTo(t);
          }}
        >
          <Text style={styles.frameIcon}>⏪</Text>
          <Text style={styles.frameLabel}>FRAME</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playBtn, status.isPlaying && { borderColor: colors.primary }]}
          onPress={() => {
            if (status.isPlaying) playerRef.current?.pause();
            else playerRef.current?.play();
          }}
        >
          <Text style={styles.playIcon}>{status.isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.frameBtn}
          onPress={() => {
            const maxT = windowStart + windowDuration;
            const t = Math.min(maxT, status.currentTime + FRAME_DURATION);
            playerRef.current?.seekTo(t);
          }}
        >
          <Text style={styles.frameIcon}>⏩</Text>
          <Text style={styles.frameLabel}>FRAME</Text>
        </TouchableOpacity>
      </View>

      {/* Current position time */}
      <Text style={styles.positionText}>{fmt(status.currentTime - windowStart)} / {fmt(windowDuration)}s</Text>

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.foul }]} onPress={handleMarkFoul}>
          <Text style={[styles.actionText, { color: colors.foul }]}>⚠ MARK FOUL</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.goal }]} onPress={handleNoFoul}>
          <Text style={[styles.actionText, { color: colors.goal }]}>✓ NO FOUL</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtnSecondary, { borderColor: colors.primary }]}>
          <Text style={[styles.actionText, { color: colors.primary }]}>💾 SAVE CLIP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtnSecondary, { borderColor: colors.textDim }]} onPress={() => navigation.goBack()}>
          <Text style={[styles.actionText, { color: colors.textDim }]}>✕ BACK</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Empty state
  emptyState: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  emptyIcon: { fontSize: 48, opacity: 0.5 },
  backBtn: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
  },

  // Video
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    flex: 1,
  },
  timeOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  timeText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigPlayBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  bigPlayIcon: {
    fontSize: 28,
    color: colors.text,
    marginLeft: 4,
  },

  // Timeline
  timelineSection: {
    paddingHorizontal: TIMELINE_PADDING,
    marginTop: spacing.xxl,
  },
  timelineOuter: {
    height: 64,
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: 4,
    position: 'relative',
    overflow: 'visible',
  },
  timelineTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1.5,
    height: '100%',
  },
  timelineBar: {
    flex: 1,
    borderRadius: 2,
    maxHeight: '90%',
  },
  playhead: {
    position: 'absolute',
    top: -4,
    bottom: -4,
    width: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },

  // Bookmark dots
  bmDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    top: -7,
    zIndex: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 4,
  },

  // Time labels
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },

  // Frame controls
  frameControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginTop: spacing.xl,
  },
  frameBtn: {
    alignItems: 'center',
    gap: 2,
  },
  frameIcon: {
    fontSize: 22,
    color: colors.text,
  },
  frameLabel: {
    fontSize: 9,
    color: colors.textDim,
    fontWeight: '600',
    letterSpacing: 0.5,
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
  playIcon: {
    fontSize: 26,
  },

  // Position time
  positionText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    marginTop: spacing.sm,
    fontVariant: ['tabular-nums'],
  },

  // Action buttons
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    paddingHorizontal: TIMELINE_PADDING,
  },
  actionBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  actionBtnSecondary: {
    flex: 1,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
