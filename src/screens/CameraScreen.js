import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { colors, spacing, typography, borderRadius } from '../theme';
import useAppStore from '../store/useAppStore';

// ─── Logo Component ───────────────────────────────────────
function Logo({ size = 40 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Shield outline */}
      <Path
        d="M50 5 L90 20 L90 50 C90 75 70 92 50 97 C30 92 10 75 10 50 L10 20 Z"
        stroke={colors.primary}
        strokeWidth={4}
        fill={colors.primaryDim}
      />
      {/* Football hex pattern */}
      <Path
        d="M50 30 L65 40 L65 55 L50 65 L35 55 L35 40 Z"
        stroke={colors.primary}
        strokeWidth={2.5}
        fill="none"
      />
      {/* Inner lines */}
      <Path
        d="M50 30 L50 45 M35 40 L50 45 L65 40 M35 55 L50 45 L65 55"
        stroke={colors.primary}
        strokeWidth={2}
        fill="none"
      />
      {/* VAR text */}
      <Path
        d="M40 70 L42 70 L44 76 L46 70 L48 70 M42 73 L46 73 M50 70 L52 70 L52 76 L54 70 L56 70 L56 76 L54 76 M58 70 L58 76 L60 76 L62 73 L60 70 L58 70"
        stroke={colors.primary}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

// ─── Bookmark Button ───────────────────────────────────────
function BookmarkButton({ label, color, icon, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.bookmarkBtn, { borderColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.bookmarkIcon]}>{icon}</Text>
      <Text style={[styles.bookmarkLabel, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Recording Dot ─────────────────────────────────────────
function RecordingDot({ isRecording }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => setPulse((p) => !p), 600);
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!isRecording) return null;

  return (
    <View style={styles.recordingIndicator}>
      <View
        style={[
          styles.recordingDot,
          { opacity: pulse ? 0.4 : 1 },
        ]}
      />
      <Text style={styles.recordingText}>REC</Text>
    </View>
  );
}

// ─── Main Camera Screen ────────────────────────────────────
export default function CameraScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const { isRecording, setRecording } = useAppStore();

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  const handleRecord = async () => {
    if (isRecording) {
      await cameraRef.current?.stopRecording();
      setRecording(false);
    } else {
      setRecording(true);
      try {
        const video = await cameraRef.current?.recordAsync();
        console.log('Video saved:', video?.uri);
      } catch (e) {
        console.log('Record error:', e);
      }
      setRecording(false);
    }
  };

  const handleBookmark = (type) => {
    if (!isRecording) {
      Alert.alert('Not Recording', 'Start recording first to mark moments.');
      return;
    }
    console.log(`Bookmark: ${type} at`, Date.now());
  };

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
          <TouchableOpacity style={styles.permitBtn} onPress={requestPermission}>
            <Text style={[typography.button, { color: colors.background }]}>Grant Access</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
      />

      {/* Dark overlay at top for button contrast */}
      <View style={styles.topOverlay}>
        <RecordingDot isRecording={isRecording} />
      </View>

      {/* Bookmark Buttons — Top Row */}
      <View style={styles.topBar}>
        <BookmarkButton label="REVIEW" color={colors.primary} icon="◉" onPress={() => navigation.navigate('Review')} />
        <BookmarkButton label="GOAL" color={colors.goal} icon="⚽" onPress={() => handleBookmark('goal')} />
        <BookmarkButton label="FOUL" color={colors.foul} icon="⚠" onPress={() => handleBookmark('foul')} />
        <BookmarkButton label="OFFSIDE" color={colors.offside} icon="🚩" onPress={() => handleBookmark('offside')} />
        <BookmarkButton label="YC" color={colors.yellowCard} icon="🟨" onPress={() => handleBookmark('yellow_card')} />
        <BookmarkButton label="RC" color={colors.redCard} icon="🟥" onPress={() => handleBookmark('red_card')} />
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.settingsIcon}>⚙</Text>
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

        <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Clips')}>
          <Text style={styles.settingsIcon}>🎬</Text>
        </TouchableOpacity>
      </View>

      {/* Logo watermark */}
      <View style={styles.watermark}>
        <Logo size={24} />
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permitBtn: {
    marginTop: 24,
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
  },

  // Top bar with bookmark buttons
  topBar: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 10,
    flexWrap: 'wrap',
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  // Bookmark button
  bookmarkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
  },
  bookmarkIcon: {
    fontSize: 12,
  },
  bookmarkLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Recording indicator
  recordingIndicator: {
    position: 'absolute',
    top: 12,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.recording,
  },
  recordingText: {
    color: colors.recording,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  recordBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.text,
  },
  recordBtnActive: {
    borderColor: colors.recording,
  },
  recordInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.recording,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordInnerActive: {
    backgroundColor: '#CC0022',
  },
  recordText: {
    fontSize: 22,
    color: colors.text,
  },
  settingsBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 22,
  },

  // Watermark
  watermark: {
    position: 'absolute',
    top: 14,
    right: 14,
    opacity: 0.5,
  },
});
