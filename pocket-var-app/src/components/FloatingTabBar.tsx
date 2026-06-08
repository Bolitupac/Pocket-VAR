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
import { colors, radius, typography } from '../theme';

/**
 * FloatingTabBar
 *
 * A glassmorphic floating navigation bar that sits at the bottom of every
 * screen, floating above the content. Contains:
 *  - Logo mark on the left (POCKET VAR wordmark)
 *  - Four icon+label tabs: Camera · Review · Clips · Settings
 *
 * Usage: render inside any screen's root <View> with position: relative.
 * The bar uses position: absolute so it always floats at the bottom.
 */

type Tab = {
  route: string;
  icon: string;
  label: string;
};

const TABS: Tab[] = [
  { route: '/',         icon: '⬤',  label: 'CAM'      },
  { route: '/review',   icon: '▶',  label: 'REVIEW'   },
  { route: '/clips',    icon: '🎬', label: 'CLIPS'    },
  { route: '/settings', icon: '⚙', label: 'SETTINGS' },
];

export function FloatingTabBar() {
  const router   = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.container}>
        {/* ── Logo mark ─────────────────────────── */}
        <View style={styles.logoWrap}>
          <Text style={styles.logoPocket}>POCKET</Text>
          <Text style={styles.logoVar}>VAR</Text>
        </View>

        {/* ── Divider ──────────────────────────── */}
        <View style={styles.divider} />

        {/* ── Tabs ─────────────────────────────── */}
        <View style={styles.tabs}>
          {TABS.map((tab) => {
            const active = pathname === tab.route ||
              (tab.route === '/' && pathname === '/index');

            return (
              <TouchableOpacity
                key={tab.route}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => router.push(tab.route as any)}
                activeOpacity={0.7}
              >
                {/* Camera tab shows a live-record dot */}
                {tab.route === '/' ? (
                  <View style={[styles.camDot, active && styles.camDotActive]} />
                ) : (
                  <Text style={[styles.tabIcon, active && styles.tabIconActive]}>
                    {tab.icon}
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

// ── Styles ───────────────────────────────────────────────────────

const BAR_HEIGHT   = 68;
const BOTTOM_GAP   = 20;
const SIDE_MARGIN  = 16;

const styles = StyleSheet.create({
  // Outer wrapper — fills the screen, lets touches pass through empty space
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: BOTTOM_GAP,
    paddingHorizontal: SIDE_MARGIN,
  },

  // Glassmorphic pill container
  container: {
    height: BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 18, 8, 0.82)',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.20)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    // iOS blur simulation via shadow + tinted bg
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#22C55E',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 24,
        }
      : { elevation: 20 }),
  },

  // ── Logo ──
  logoWrap: {
    alignItems: 'flex-start',
    marginRight: 10,
    paddingLeft: 4,
  },
  logoPocket: {
    fontSize: 8,
    fontWeight: '700' as const,
    letterSpacing: 2,
    color: colors.textSecondary,
    lineHeight: 10,
  },
  logoVar: {
    fontSize: 18,
    fontWeight: '900' as const,
    letterSpacing: 1,
    color: colors.primary,
    lineHeight: 20,
  },

  // ── Vertical divider ──
  divider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(34, 197, 94, 0.18)',
    marginRight: 6,
  },

  // ── Tab row ──
  tabs: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: radius.md,
  },

  tabActive: {
    backgroundColor: colors.primaryGlass,
  },

  // ── Camera record dot ──
  camDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.textDim,
    marginBottom: 3,
  },
  camDotActive: {
    backgroundColor: colors.recording,
    shadowColor: colors.recording,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },

  // ── Tab icon / label ──
  tabIcon: {
    fontSize: 13,
    color: colors.textDim,
    marginBottom: 2,
  },
  tabIconActive: {
    color: colors.primary,
  },

  tabLabel: {
    fontSize: 8,
    fontWeight: '700' as const,
    letterSpacing: 1.2,
    color: colors.textDim,
  },
  tabLabelActive: {
    color: colors.primary,
  },
});
