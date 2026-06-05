import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { VideoView, useVideoPlayer } from 'expo-video';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { colors, spacing, typography, borderRadius } from '../theme';
import useAppStore from '../store/useAppStore';
import { deleteClip as dbDeleteClip, getClipsForMatch } from '../utils/database';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_GAP = 10;
const COL_WIDTH = (SCREEN_WIDTH - GRID_GAP * 2 - 20) / 2;

// ─── Badge colors ─────────────────────────────────────────
const BADGE = {
  goal:       { label: 'GOAL',     color: '#00FF88', bg: 'rgba(0,255,136,0.2)' },
  foul:       { label: 'FOUL',     color: '#FF6600', bg: 'rgba(255,102,0,0.2)' },
  offside:    { label: 'OFFSIDE',  color: '#FFD700', bg: 'rgba(255,215,0,0.2)' },
  yellow_card:{ label: 'YC',       color: '#FFD700', bg: 'rgba(255,215,0,0.2)' },
  red_card:   { label: 'RC',       color: '#FF3355', bg: 'rgba(255,51,85,0.2)' },
};

const fmtDur = (s) => {
  const sec = Math.round(s || 0);
  return `${sec}s`;
};

const fmtDate = (d) => {
  const date = new Date(d);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

// ─── Clip Card ─────────────────────────────────────────────
function ClipCard({ clip, onPlay, onShare, onDelete }) {
  const badge = BADGE[clip.type] || BADGE.foul;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPlay(clip)} activeOpacity={0.85}>
      {/* Thumbnail area */}
      <View style={styles.cardThumb}>
        {clip.thumbnail_path ? (
          <Image source={{ uri: clip.thumbnail_path }} style={styles.thumbImg} />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Text style={styles.thumbIcon}>🎬</Text>
          </View>
        )}

        {/* Duration badge */}
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{fmtDur(clip.duration_seconds)}</Text>
        </View>

        {/* Play button overlay */}
        <View style={styles.playOverlaySmall}>
          <Text style={styles.playIconSmall}>▶</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.cardInfo}>
        <View style={[styles.typeBadge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.typeText, { color: badge.color }]}>{badge.label}</Text>
        </View>
        <Text style={styles.cardDate}>{fmtDate(clip.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Video Player Modal ────────────────────────────────────
function VideoPlayerModal({ visible, clip, onClose }) {
  if (!clip) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.modalBadgeRow}>
              {clip.type && (
                <View style={[styles.typeBadge, { backgroundColor: (BADGE[clip.type] || BADGE.foul).bg }]}>
                  <Text style={[styles.typeText, { color: (BADGE[clip.type] || BADGE.foul).color }]}>
                    {(BADGE[clip.type] || BADGE.foul).label}
                  </Text>
                </View>
              )}
              <Text style={styles.modalDate}>{fmtDate(clip.created_at)}</Text>
            </View>
          </View>

          {/* Video */}
          {clip.file_path && (
            <View style={styles.modalVideoContainer}>
              <VideoView
                style={styles.modalVideo}
                source={{ uri: clip.file_path }}
                useNativeControls={true}
                nativeControls={true}
              />
            </View>
          )}

          {/* Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalActionBtn, { borderColor: colors.primary }]}
              onPress={async () => {
                if (await Sharing.isAvailableAsync()) {
                  await Sharing.shareAsync(clip.file_path);
                } else {
                  Alert.alert('Share Unavailable', 'Sharing is not available on this device.');
                }
              }}
            >
              <Text style={[styles.modalActionText, { color: colors.primary }]}>📤 Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalActionBtn, { borderColor: colors.danger }]}
              onPress={() => {
                Alert.alert(
                  'Delete Clip',
                  'This cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          // Delete file
                          if (clip.file_path) await FileSystem.deleteAsync(clip.file_path, { idempotent: true });
                          // Delete from DB
                          await dbDeleteClip(clip.id);
                          // Refresh
                          useAppStore.getState().removeClip(clip.id);
                          onClose();
                        } catch (e) {
                          Alert.alert('Error', 'Could not delete clip.');
                        }
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={[styles.modalActionText, { color: colors.danger }]}>🗑 Delete</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

// ─── Main Clips Screen ────────────────────────────────────
export default function ClipsScreen() {
  const navigation = useNavigation();
  const { clips, refreshClips, removeClip } = useAppStore();
  const [selectedClip, setSelectedClip] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Refresh clips every time screen is focused
  useFocusEffect(
    useCallback(() => {
      refreshClips();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshClips();
    setRefreshing(false);
  };

  const handlePlay = (clip) => setSelectedClip(clip);
  const handleShare = async (clip) => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(clip.file_path);
    } else {
      Alert.alert('Unavailable', 'Sharing not available.');
    }
  };
  const handleDelete = (clip) => {
    Alert.alert('Delete Clip', 'Sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            if (clip.file_path) await FileSystem.deleteAsync(clip.file_path, { idempotent: true });
            await dbDeleteClip(clip.id);
            removeClip(clip.id);
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        },
      },
    ]);
  };

  // Empty state
  if (clips.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🎬</Text>
          <Text style={[typography.h3, { marginTop: 16 }]}>No Clips Yet</Text>
          <Text style={[typography.bodySmall, { textAlign: 'center', marginTop: 8, paddingHorizontal: 40 }]}>
            Record a match, hit REVIEW, then tap SAVE CLIP to export a moment. They'll appear here.
          </Text>
          <TouchableOpacity
            style={styles.goBackBtn}
            onPress={() => navigation.navigate('Camera')}
          >
            <Text style={[typography.button, { color: colors.background }]}>Back to Camera</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <FlatList
        data={clips}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <ClipCard
            clip={item}
            onPlay={handlePlay}
            onShare={handleShare}
            onDelete={handleDelete}
          />
        )}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={styles.headerCount}>{clips.length} clip{clips.length !== 1 ? 's' : ''}</Text>
          </View>
        }
      />

      {/* Video Player Modal */}
      <VideoPlayerModal
        visible={!!selectedClip}
        clip={selectedClip}
        onClose={() => setSelectedClip(null)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Empty state
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 48, opacity: 0.5 },
  goBackBtn: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
  },

  // Grid
  grid: { padding: spacing.lg, paddingBottom: 40 },
  gridRow: { gap: GRID_GAP, marginBottom: GRID_GAP },
  headerRow: {
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerCount: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },

  // Card
  card: {
    width: COL_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  cardThumb: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.surfaceLight,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  thumbPlaceholder: { alignItems: 'center' },
  thumbIcon: { fontSize: 32, opacity: 0.4 },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  playOverlaySmall: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -14,
    marginTop: -14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconSmall: { fontSize: 12, color: '#fff', marginLeft: 2 },

  // Card info
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  cardDate: { color: colors.textDim, fontSize: 11 },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: { color: colors.text, fontSize: 18, fontWeight: '600' },
  modalBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modalDate: { color: colors.textDim, fontSize: 13 },
  modalVideoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  modalVideo: { flex: 1 },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    marginTop: spacing.xl,
  },
  modalActionBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalActionText: { fontSize: 15, fontWeight: '700' },
});
