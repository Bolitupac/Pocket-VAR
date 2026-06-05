import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, typography, borderRadius } from '../theme';
import useAppStore from '../store/useAppStore';
import { getStorageInfo, getAppStorageUsage, deleteAllRecordings } from '../utils/storage';

function SettingRow({ label, value, onPress, color }) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <Text style={[typography.body, { color: colors.text }]}>{label}</Text>
      <View style={styles.settingValue}>
        <Text style={[typography.bodySmall, { color: color || colors.primary }]}>{value}</Text>
        {onPress && <Text style={styles.chevron}>›</Text>}
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const [storage, setStorage] = useState(null);
  const [usage, setUsage] = useState(null);
  const { settings, updateSettings } = useAppStore();

  const loadStorage = useCallback(async () => {
    const [s, u] = await Promise.all([getStorageInfo(), getAppStorageUsage()]);
    setStorage(s);
    setUsage(u);
  }, []);

  useFocusEffect(useCallback(() => { loadStorage(); }, []));

  const handleClearRecordings = () => {
    Alert.alert(
      'Delete All Recordings',
      'This removes all full match recordings but keeps your saved clips. Free up space?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Recordings',
          style: 'destructive',
          onPress: async () => {
            const count = await deleteAllRecordings();
            Alert.alert('Done', `Deleted ${count} recording(s).`);
            loadStorage();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Recording ── */}
        <Text style={[typography.caption, styles.sectionTitle]}>RECORDING</Text>
        <View style={styles.section}>
          <SettingRow label="Video Quality" value={settings.videoQuality} />
          <SettingRow label="Max Review Window" value={`${settings.maxReviewSeconds}s`} />
        </View>

        {/* ── Storage ── */}
        <Text style={[typography.caption, styles.sectionTitle]}>STORAGE</Text>
        <View style={styles.section}>
          {storage && (
            <View style={styles.storageInfo}>
              <View style={styles.storageBarOuter}>
                <View
                  style={[
                    styles.storageBarInner,
                    {
                      width: `${Math.min(storage.percentUsed, 100)}%`,
                      backgroundColor: storage.isCritical
                        ? colors.danger
                        : storage.isLow
                        ? colors.warning
                        : colors.primary,
                    },
                  ]}
                />
              </View>
              <View style={styles.storageRow}>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  {storage.usedFormatted} used of {storage.totalFormatted}
                </Text>
                {storage.isLow && (
                  <Text style={[typography.caption, { color: colors.warning }]}>⚠ Low</Text>
                )}
              </View>
            </View>
          )}

          {usage && (
            <View style={styles.appUsage}>
              <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                App data: {usage.totalFormatted} · {usage.matchCount} match{usage.matchCount !== 1 ? 'es' : ''} · {usage.clipsCount} clip{usage.clipsCount !== 1 ? 's' : ''}
              </Text>
            </View>
          )}

          <SettingRow
            label="Delete Full Recordings"
            value="Free space"
            color={colors.warning}
            onPress={handleClearRecordings}
          />
        </View>

        {/* ── About ── */}
        <Text style={[typography.caption, styles.sectionTitle]}>ABOUT</Text>
        <View style={styles.section}>
          <SettingRow label="Version" value="1.0.0" />
          <SettingRow label="Developer" value="Nanbol Dassak" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  sectionTitle: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    paddingLeft: spacing.xs,
    letterSpacing: 1,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chevron: {
    color: colors.textDim, fontSize: 20, fontWeight: '300',
  },
  storageInfo: { padding: spacing.lg, paddingBottom: 0 },
  storageBarOuter: {
    height: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  storageBarInner: { height: '100%', borderRadius: 3 },
  storageRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginTop: 6,
  },
  appUsage: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
});
