import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Link } from 'expo-router';
import { colors, spacing, radius, typography } from '../theme';
import { LogoText } from '../components/LogoText';

/**
 * CameraScreen — main recording screen.
 * Stub: placeholder UI with navigation to sibling screens.
 */

export default function CameraScreen() {
  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <LogoText variant="full" size="sm" />
      </View>

      {/* Camera placeholder */}
      <View style={styles.cameraPlaceholder}>
        <Text style={styles.placeholderText}>📷 Camera preview</Text>
        <Text style={styles.placeholderHint}>expo-camera will render here</Text>
      </View>

      {/* Nav row — temporary, for testing navigation */}
      <View style={styles.navRow}>
        <Link href="/review" asChild>
          <TouchableOpacity style={styles.navBtn}>
            <Text style={styles.navLabel}>REVIEW</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/clips" asChild>
          <TouchableOpacity style={styles.navBtn}>
            <Text style={styles.navLabel}>CLIPS</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.navBtn}>
            <Text style={styles.navLabel}>SETTINGS</Text>
          </TouchableOpacity>
        </Link>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  cameraPlaceholder: {
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
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  navBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  navLabel: {
    ...typography.label,
    color: colors.primary,
  },
});
