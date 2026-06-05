import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';

export default function ClipsScreen() {
  const clips = [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      {clips.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🎬</Text>
          <Text style={[typography.h3, { marginTop: 16 }]}>No Clips Yet</Text>
          <Text style={[typography.bodySmall, { textAlign: 'center', marginTop: 8, paddingHorizontal: 40 }]}>
            Record a match and save clips from the Review screen. They'll appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={clips}
          renderItem={({ item }) => <ClipCard clip={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

function ClipCard({ clip }) {
  return (
    <View style={styles.clipCard}>
      <View style={styles.clipThumbnail} />
      <View style={styles.clipInfo}>
        <Text style={[typography.body, { fontWeight: '600' }]}>{clip.type}</Text>
        <Text style={typography.caption}>{clip.duration}s</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 48, opacity: 0.5 },
  list: { padding: spacing.lg, gap: spacing.md },
  clipCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  clipThumbnail: {
    width: 100,
    aspectRatio: 16 / 9,
    backgroundColor: colors.surfaceLight,
  },
  clipInfo: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
});
