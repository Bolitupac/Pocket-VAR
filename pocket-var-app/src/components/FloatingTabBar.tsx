import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, radius } from '../theme';

type Tab = {
  route: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const TABS: Tab[] = [
  { route: '/',         label: 'CAM',    icon: 'record-circle' },
  { route: '/review',   label: 'REVIEW', icon: 'play-circle' },
  { route: '/clips',    label: 'CLIPS',  icon: 'filmstrip-box-multiple' },
  { route: '/settings', label: 'CONFIG', icon: 'cog' },
];

export function FloatingTabBar() {
  const router   = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.container}>
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
                  <View style={[styles.recDot, active && styles.recDotActive]} />
                ) : (
                  <MaterialCommunityIcons
                    name={tab.icon}
                    size={18}
                    color={active ? colors.text : colors.textDim}
                  />
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
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.96)',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 6,
    paddingVertical: 6,
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
    paddingVertical: 6,
    borderRadius: radius.md,
    gap: 3,
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },

  recDot: {
    width: 9,
    height: 9,
    borderRadius: 99,
    backgroundColor: colors.textDim,
  },
  recDotActive: {
    backgroundColor: colors.recording,
  },

  tabLabel: {
    fontSize: 8,
    fontWeight: '700' as const,
    letterSpacing: 1.2,
    color: colors.textDim,
  },
  tabLabelActive: {
    color: colors.text,
  },
});
