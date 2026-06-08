import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { FloatingTabBar } from '../components/FloatingTabBar';

/**
 * SettingsScreen — video quality, storage info, about section.
 * Premium glass UI with floating tab bar.
 */

type SettingRow = {
  label: string;
  value: string;
  accent?: boolean;
};

type SettingSection = {
  title: string;
  rows: SettingRow[];
};

const SECTIONS: SettingSection[] = [
  {
    title: 'VIDEO',
    rows: [
      { label: 'Quality',      value: '1080p 60fps' },
      { label: 'Buffer',       value: '60 seconds' },
      { label: 'Format',       value: 'H.264 / MP4' },
      { label: 'Stabiliser',   value: 'On' },
    ],
  },
  {
    title: 'STORAGE',
    rows: [
      { label: 'Used',         value: '2.4 GB' },
      { label: 'Available',    value: '14.2 GB' },
      { label: 'Auto-delete',  value: 'After 7 days' },
      { label: 'Clear Cache',  value: 'Tap to clear', accent: true },
    ],
  },
  {
    title: 'ABOUT',
    rows: [
      { label: 'Version',      value: '1.0.0 (beta)' },
      { label: 'SDK',          value: 'Expo 56' },
      { label: 'Build',        value: 'pocket-var-app' },
    ],
  },
];

export default function SettingsScreen() {
  return (
    <View style={styles.root}>

      {/* ── Top HUD ─────────────────────────────── */}
      <View style={styles.hud}>
        <View style={styles.logoWrap}>
          <Text style={styles.logoPocket}>POCKET</Text>
          <Text style={styles.logoVar}>VAR</Text>
        </View>
        <Text style={styles.screenTitle}>SETTINGS</Text>
        {/* Spacer to balance layout */}
        <View style={{ width: 60 }} />
      </View>

      {/* ── Settings List ───────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            {/* Section title */}
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {/* Section card */}
            <View style={styles.card}>
              {section.rows.map((row, idx) => (
                <View key={row.label}>
                  <TouchableOpacity
                    style={styles.row}
                    activeOpacity={row.accent ? 0.5 : 1}
                  >
                    <Text style={styles.rowLabel}>{row.label}</Text>
                    <Text style={[styles.rowValue, row.accent && styles.rowValueAccent]}>
                      {row.value}
                    </Text>
                  </TouchableOpacity>
                  {idx < section.rows.length - 1 && (
                    <View style={styles.rowDivider} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Version footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>POCKET</Text>
          <Text style={styles.footerVar}>VAR</Text>
          <Text style={styles.footerSub}>Football VAR · Built with Expo</Text>
        </View>
      </ScrollView>

      {/* ── Floating Tab Bar ────────────────────── */}
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
    paddingTop: spacing.xxxl + spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: 'rgba(8, 11, 8, 0.60)',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  logoWrap: { alignItems: 'flex-start' },
  logoPocket: {
    fontSize: 8, fontWeight: '700', letterSpacing: 2.5,
    color: colors.textSecondary, lineHeight: 10,
  },
  logoVar: {
    fontSize: 20, fontWeight: '900', letterSpacing: 1,
    color: colors.primary, lineHeight: 22,
  },
  screenTitle: {
    fontSize: 12, fontWeight: '700', letterSpacing: 3,
    color: colors.textSecondary,
  },

  // ── Scroll
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 120,   // clear floating bar
  },

  // ── Section
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: colors.primary,
    marginBottom: spacing.sm,
    paddingLeft: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  // ── Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  rowValueAccent: {
    color: colors.primary,
    fontWeight: '600',
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.lg,
  },

  // ── Footer
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerLogo: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 3,
    color: colors.textDim,
  },
  footerVar: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
    color: colors.primaryDim.replace('0.15', '0.35'),
    marginTop: 2,
  },
  footerSub: {
    fontSize: 11,
    color: colors.textDim,
    marginTop: spacing.sm,
    letterSpacing: 0.5,
  },
});
