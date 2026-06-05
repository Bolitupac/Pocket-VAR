import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme';
import ErrorBoundary from '../components/ErrorBoundary';
import CameraScreen from '../screens/CameraScreen';
import ReviewScreen from '../screens/ReviewScreen';
import ClipsScreen from '../screens/ClipsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '600', fontSize: 18 },
  contentStyle: { backgroundColor: colors.background },
  animation: 'slide_from_right',
};

export default function AppNavigator() {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.primary,
        },
      }}
    >
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="Camera"
          options={{ headerShown: false }}
        >
          {() => (
            <ErrorBoundary>
              <CameraScreen />
            </ErrorBoundary>
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Review"
          options={{
            title: 'Review',
            headerBackTitle: 'Camera',
          }}
        >
          {() => (
            <ErrorBoundary>
              <ReviewScreen />
            </ErrorBoundary>
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Clips"
          component={ClipsScreen}
          options={{ title: 'Saved Clips' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
