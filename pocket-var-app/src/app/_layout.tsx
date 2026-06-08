import { Stack } from 'expo-router';
import { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme';

/**
 * Root layout — wraps every screen in a dark Stack navigator.
 * Each screen renders its own FloatingTabBar so it floats over content.
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
      headerShown: false,
      contentStyle: { backgroundColor: colors.background },
      animation: 'fade' as const,
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
