import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';

function SettingRow({ label, value, onPress }) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
      <Text style={[typography.body, { color: colors.text }]}>{label}</Text>
      <View style={styles.settingValue}>
        <Text style={[typography.bodySmall, { color: colors.primary }]}>{value}</Text>
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.caption, styles.sectionTitle]}>RECORDING</Text>
        <View style={styles.section}>
          <SettingRow label="Video Quality" value="1080p" />
          <SettingRow label="Camera" value="Back" />
          <SettingRow label="Max Review Window" value="60 seconds" />
        </View>

        <Text style={[typography.caption, styles.sectionTitle]}>STORAGE</Text>
        <View style={styles.section}>
          <View style={styles.storageInfo}>
            <View style={styles.storageBarOuter}>
              <View style={[styles.storageBarInner, { width: '0%' }]} />
            </View>
            <Text style={[typography.caption, { marginTop: 6 }]}>0 MB used</Text>
          </View>
          <SettingRow label="Auto-save Clips" value="On" />
          <SettingRow label="Clear All Data" value="" />
        </View>

        <Text style={[typography.caption, styles.sectionTitle]}>ABOUT</Text>
        <View style={styles.section}>
          <SettingRow label="Version" value="1.0.0" />
          <SettingRow label="Pocket VAR" value="⚽ Powered by you" />
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
    color: colors.textDim,
    fontSize: 20,
    fontWeight: '300',
  },
  storageInfo: {
    padding: spacing.lg,
  },
  storageBarOuter: {
    height: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  storageBarInner: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
});
