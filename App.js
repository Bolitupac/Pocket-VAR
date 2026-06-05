import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase } from './src/utils/database';
import useAppStore from './src/store/useAppStore';
import { colors } from './src/theme';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const loadFromDatabase = useAppStore((s) => s.loadFromDatabase);

  useEffect(() => {
    (async () => {
      try {
        // 1. Initialize SQLite database (creates tables if needed)
        await initDatabase();
        console.log('[App] Database ready');

        // 2. Load existing data from SQLite into Zustand state
        await loadFromDatabase();

        // 3. Hide splash, show app
        setReady(true);
        await SplashScreen.hideAsync();
      } catch (e) {
        console.error('[App] Init error:', e);
        setError(e.message);
        setReady(true);
        await SplashScreen.hideAsync();
      }
    })();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
        <Text style={{ color: colors.danger, fontSize: 18, fontWeight: '700' }}>Startup Error</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 10, textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}
