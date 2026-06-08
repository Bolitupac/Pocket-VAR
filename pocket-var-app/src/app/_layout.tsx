import { Stack } from 'expo-router';
import { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme';

/**
 * Root layout — wraps every screen in a dark-themed Stack navigator.
 *
 * Screen map (file-based routing):
 *   /          → CameraScreen
 *   /review    → ReviewScreen
 *   /clips     → ClipsScreen
 *   /settings  → SettingsScreen
 */

export default function RootLayout() {
  const screenOptions = useCallback(
    () => ({
      headerShown: false,   // every screen manages its own chrome
      contentStyle: { backgroundColor: colors.background },
      animation: 'slide_from_right' as const,
    }),
    [],
  );

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={screenOptions} />
    </>
  );
}
