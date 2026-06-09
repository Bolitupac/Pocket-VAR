import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { colors, radius } from '../theme';

type Tab = {
  route: string;
  label: string;
  symbol: string;
};

const TABS: Tab[] = [
  { route: '/',         label: 'CAM',    symbol: '◉' },
  { route: '/review',   label: 'REVIEW', symbol: '▶' },
  { route: '/clips',    label: 'CLIPS',  symbol: '⊞' },
  { route: '/settings', label: 'CONFIG', symbol: '⊛' },
];

export function FloatingTabBar() {
  const router   = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.container}>

        {/* Brand seal — white chip with real logo image */}
        <View style={styles.logoChip}>
          <Image
            source={require('../../assets/images/pocket-var-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.tabs}>
          {TABS.map((tab) => {
            const active =
              pathname === tab.route ||
              (tab.route === '/' && pathname === '/index');

            return (
              <TouchableOpacity
                key={tab.route}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => router.push(tab.route as any)}
                activeOpacity={0.7}
              >
                {tab.route === '/' ? (
                  <View style={[styles.recIndicator, active && styles.recIndicatorActive]} />
                ) : (
                  <Text style={[styles.tabSymbol, active && styles.tabSymbolActive]}>
                    {tab.symbol}
                  </Text>
                )}
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },

  container: {
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(4, 10, 4, 0.94)',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.22,
          shadowRadius: 20,
        }
      : { elevation: 24 }),
  },

  logoChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: 60,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 56,
    height: 40,
  },

  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    marginHorizontal: 8,
  },

  tabs: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 2,
    borderRadius: radius.md,
    gap: 2,
  },
  tabActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.10)',
  },

  recIndicator: {
    width: 9,
    height: 9,
    borderRadius: 99,
    backgroundColor: colors.textDim,
  },
  recIndicatorActive: {
    backgroundColor: colors.recording,
    shadowColor: colors.recording,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },

  tabSymbol: {
    fontSize: 12,
    color: colors.textDim,
  },
  tabSymbolActive: {
    color: colors.primary,
  },

  tabLabel: {
    fontSize: 7,
    fontWeight: '700' as const,
    letterSpacing: 1.1,
    color: colors.textDim,
  },
  tabLabelActive: {
    color: colors.primary,
  },
});
