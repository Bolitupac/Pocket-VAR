import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
  Animated,
  Vibration,
  Platform,
  Switch,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing, typography, borderRadius } from '../theme';
import useAppStore from '../store/useAppStore';
import { checkStorageAndWarn } from '../utils/storage';

// ─── Logo ──────────────────────────────────────────────────
function Logo({ size = 40 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Path
        d="M50 5 L90 20 L90 50 C90 75 70 92 50 97 C30 92 10 75 10 50 L10 20 Z"
        stroke={colors.primary} strokeWidth={4} fill={colors.primaryDim}
      />
      <Path
        d="M50 30 L65 40 L65 55 L50 65 L35 55 L35 40 Z"
        stroke={colors.primary} strokeWidth={2.5} fill="none"
      />
      <Path
        d="M50 30 L50 45 M35 40 L50 45 L65 40 M35 55 L50 45 L65 55"
        stroke={colors.primary} strokeWidth={2} fill="none"
      />
    </Svg>
  );
}

// ─── Bookmark Button ───────────────────────────────────────
function BookmarkButton({ label, color, icon, disabled, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.bookmarkBtn,
        { borderColor: color, opacity: disabled ? 0.35 : 1 },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={styles.bookmarkIcon}>{icon}</Text>
      <Text style={[styles.bookmarkLabel, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Elapsed Timer ─────────────────────────────────────────
function ElapsedTimer({ seconds }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <View style={styles.timerContainer}>
      <View style={styles.timerDot} />
      <Text style={styles.timerText}>REC {pad(m)}:{pad(s)}</Text>
    </View>
  );
}

// ─── Flash Overlay ─────────────────────────────────────────
function FlashOverlay({ color, visible }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.6, duration: 60, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { backgroundColor: color, opacity }]}
    />
  );
}

// ─── Bookmark Toast ────────────────────────────────────────
function BookmarkToast({ type, visible }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.delay(400),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View pointerEvents="none" style={[styles.toast, { opacity }]}>
      <Text style={styles.toastText}>{type.toUpperCase()} ✓</Text>
    </Animated.View>
  );
}

// ─── Not Recording Overlay ─────────────────────────────────
function NotRecordingBanner({ visible }) {
  if (!visible) return null;
  return (
    <View style={styles.notRecordingBanner} pointerEvents="none">
      <Text style={styles.notRecordingText}>Tap ▶ to start recording</Text>
    </View>
  );
}

// ─── Main Camera Screen ────────────────────────────────────
export default function CameraScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [flashColor, setFlashColor] = useState(null);
  const [toastType, setToastType] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [flash, setFlash] = useState('off');
  const [zoom, setZoom] = useState(0);

  const {
    isRecording,
    elapsedSeconds,
    startRecording,
    stopRecording,
    tickElapsed,
    addBookmark,
    addMatch,
    currentMatchId,
  } = useAppStore();

  // Elapsed timer tick
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => tickElapsed(), 200);
    return () => clearInterval(interval);
  }, [isRecording]);

  // Hide "not recording" banner after 4s
  useEffect(() => {
    if (isRecording) setBannerVisible(false);
    const t = setTimeout(() => setBannerVisible(false), 4000);
    return () => clearTimeout(t);
  }, []);

  // Permission auto-request
  useEffect(() => {
    if (permission && !permission.granted && !permission.canAskAgain) {
      Alert.alert(
        'Camera Required',
        'Pocket VAR needs camera access to record matches. Enable it in your device settings.'
      );
    }
    // Check storage on mount
    checkStorageAndWarn();
  }, [permission]);

  const handleRecord = useCallback(async () => {
    try {
      if (isRecording) {
        // ── STOP ──
        await cameraRef.current?.stopRecording();
        stopRecording(null);
      } else {
        // ── START ──
        const matchId = `match_${Date.now()}`;
        startRecording(matchId);
        addMatch({
          id: matchId,
          date: new Date().toISOString(),
          durationSeconds: 0,
          bookmarks: 0,
        });

        const video = await cameraRef.current?.recordAsync();
        if (video?.uri) {
          // Move to persistent storage
          const destDir = `${FileSystem.documentDirectory}matches/${matchId}`;
          await FileSystem.makeDirectoryAsync(destDir, { intermediates: true });
          const destPath = `${destDir}/recording.mp4`;
          await FileSystem.moveAsync({ from: video.uri, to: destPath });
          stopRecording(destPath);
        } else {
          stopRecording(null);
        }
      }
    } catch (e) {
      console.error('Record error:', e);
      stopRecording(null);
      Alert.alert('Recording Error', e.message || 'Could not complete recording.');
    }
  }, [isRecording]);

  const handleBookmark = useCallback(
    (type) => {
      if (!isRecording) {
        setBannerVisible(true);
        setTimeout(() => setBannerVisible(false), 3000);
        return;
      }

      const bookmark = addBookmark(type);
      if (!bookmark) return;

      // Haptic
      try { Vibration.vibrate(20); } catch {}

      // Flash
      const flashColors = {
        goal: colors.goal,
        foul: colors.foul,
        offside: colors.offside,
        yellow_card: colors.yellowCard,
        red_card: colors.redCard,
      };
      setFlashColor(flashColors[type] || colors.primary);
      setTimeout(() => setFlashColor(null), 300);

      // Toast
      const labels = { goal: 'GOAL', foul: 'FOUL', offside: 'OFFSIDE', yellow_card: 'YC', red_card: 'RC' };
      setToastType(labels[type] || type);
      setTimeout(() => setToastType(null), 600);
    },
    [isRecording]
  );

  // ── Permission Not Granted ─────────────────────────────
  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <View style={styles.centerContent}>
          <Logo size={60} />
          <Text style={[typography.h2, { marginTop: 20 }]}>Camera Access Needed</Text>
          <Text style={[typography.bodySmall, { textAlign: 'center', marginTop: 10, paddingHorizontal: 40 }]}>
            Pocket VAR needs camera access to record matches.
          </Text>
          {permission?.canAskAgain !== false ? (
            <TouchableOpacity style={styles.permitBtn} onPress={requestPermission}>
              <Text style={[typography.button, { color: colors.background }]}>Grant Access</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[typography.caption, { marginTop: 20, textAlign: 'center', paddingHorizontal: 40 }]}>
              Camera permission was permanently denied. Go to Settings > Apps > Pocket VAR > Permissions to enable.
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // ── Main UI ────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Camera Preview */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        mode="video"
        facing="back"
        mute={false}
        videoQuality="1080p"
        flash={flash}
        zoom={zoom}
      />

      {/* Flash overlay on bookmark */}
      <FlashOverlay color={flashColor} visible={!!flashColor} />

      {/* Bookmark toast */}
      <BookmarkToast type={toastType} visible={!!toastType} />

      {/* Top overlay gradient */}
      <View style={styles.topOverlay} />

      {/* Elapsed timer / Rec indicator */}
      {isRecording && <ElapsedTimer seconds={elapsedSeconds} />}
      <NotRecordingBanner visible={bannerVisible && !isRecording} />

      {/* Bookmark buttons row */}
      <View style={styles.topBar}>
        <BookmarkButton
          label="REVIEW"
          color={colors.primary}
          icon="◉"
          disabled={isRecording}
          onPress={() => {
            if (currentMatchId) navigation.navigate('Review');
            else Alert.alert('No Match', 'Record a match first before reviewing.');
          }}
        />
        <BookmarkButton label="GOAL" color={colors.goal} icon="⚽" disabled={false} onPress={() => handleBookmark('goal')} />
        <BookmarkButton label="FOUL" color={colors.foul} icon="⚠" disabled={false} onPress={() => handleBookmark('foul')} />
        <BookmarkButton label="OFF" color={colors.offside} icon="🚩" disabled={false} onPress={() => handleBookmark('offside')} />
        <BookmarkButton label="YC" color={colors.yellowCard} icon="🟨" disabled={false} onPress={() => handleBookmark('yellow_card')} />
        <BookmarkButton label="RC" color={colors.redCard} icon="🟥" disabled={false} onPress={() => handleBookmark('red_card')} />
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.sideBtn} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.sideIcon}>⚙</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.recordBtn, isRecording && styles.recordBtnActive]}
          onPress={handleRecord}
          activeOpacity={0.8}
        >
          <View style={[styles.recordInner, isRecording && styles.recordInnerActive]}>
            <Text style={styles.recordText}>{isRecording ? '◼' : '▶'}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideBtn} onPress={() => navigation.navigate('Clips')}>
          <Text style={styles.sideIcon}>🎬</Text>
        </TouchableOpacity>
      </View>

      {/* Logo watermark */}
      <View style={styles.watermark}>
        <Logo size={22} />
      </View>

      {/* Flash toggle */}
      <TouchableOpacity style={styles.flashBtn} onPress={() => setFlash(flash === 'off' ? 'on' : flash === 'on' ? 'torch' : 'off')}>
        <Text style={styles.flashIcon}>
          {flash === 'off' ? '☀' : flash === 'on' ? '☀' : '🔦'}
        </Text>
        <Text style={styles.flashLabel}>
          {flash === 'off' ? 'OFF' : flash === 'on' ? 'ON' : 'TORCH'}
        </Text>
      </TouchableOpacity>

      {/* Zoom slider */}
      <View style={styles.zoomContainer}>
        <Text style={styles.zoomLabel}>1x</Text>
        <View style={styles.zoomTrack}>
          <View style={[styles.zoomFill, { width: `${zoom * 100}%` }]} />
        </View>
        <TouchableOpacity
          style={styles.zoomThumb}
          onPress={() => setZoom(zoom >= 0.5 ? 0 : 0.5)}
        >
          <Text style={styles.zoomThumbText}>{zoom === 0 ? '1×' : `${(1 + zoom * 4).toFixed(1)}×`}</Text>
        </TouchableOpacity>
        <Text style={styles.zoomLabel}>5x</Text>
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Permission screen
  centerContent: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  permitBtn: {
    marginTop: 24,
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
  },

  // Top bar
  topOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: Platform.OS === 'ios' ? 120 : 100,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 70 : 60,
    left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 8,
    flexWrap: 'wrap',
  },
  bookmarkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: 7,
    paddingVertical: 5,
    gap: 3,
  },
  bookmarkIcon: { fontSize: 11 },
  bookmarkLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },

  // Timer
  timerContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 8 : 10,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
  },
  timerDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.recording,
  },
  timerText: {
    color: colors.recording,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontVariant: ['tabular-nums'],
  },

  // Not recording banner
  notRecordingBanner: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 90,
    left: 0, right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  notRecordingText: {
    color: colors.textSecondary,
    fontSize: 13,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },

  // Toast
  toast: {
    position: 'absolute',
    top: '40%',
    left: 0, right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  toastText: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 3,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  recordBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: colors.text,
  },
  recordBtnActive: { borderColor: colors.recording },
  recordInner: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: colors.recording,
    justifyContent: 'center', alignItems: 'center',
  },
  recordInnerActive: { backgroundColor: '#CC0022' },
  recordText: { fontSize: 22, color: colors.text },
  sideBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  sideIcon: { fontSize: 22 },

  // Watermark
  watermark: {
    position: 'absolute', top: 12, right: 14, opacity: 0.4,
  },

  // Flash toggle
  flashBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 110 : 100,
    left: 14,
    alignItems: 'center',
    zIndex: 10,
  },
  flashIcon: { fontSize: 20 },
  flashLabel: { color: colors.text, fontSize: 9, fontWeight: '600', marginTop: 2 },

  // Zoom slider
  zoomContainer: {
    position: 'absolute',
    right: 10,
    top: '50%',
    marginTop: -60,
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
  },
  zoomLabel: { color: colors.textDim, fontSize: 10, fontWeight: '500' },
  zoomTrack: {
    width: 4,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  zoomFill: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
    flex: 1,
  },
  zoomThumb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  zoomThumbText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
});
