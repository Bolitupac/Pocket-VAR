import { View, StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';
import { colors, spacing, radius, typography } from '../theme';
import { LogoText } from '../components/LogoText';

/**
 * SettingsScreen — video quality, storage info, about section.
 * Stub: placeholder with back navigation.
 */

export default function SettingsScreen() {
  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Link href="/" style={styles.backLink}>← Camera</Link>
        <LogoText variant="short" size="sm" />
      </View>

      {/* Settings placeholder */}
      <View style={styles.settingsPlaceholder}>
        <Text style={styles.placeholderText}>⚙️ Settings</Text>
        <Text style={styles.placeholderHint}>Video quality · Storage · About</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backLink: {
    ...typography.body,
    color: colors.primary,
  },
  settingsPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    margin: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  placeholderText: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  placeholderHint: {
    ...typography.caption,
    color: colors.textDim,
    marginTop: spacing.sm,
  },
});
