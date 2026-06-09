import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, spacing, radius } from '../theme';
import { FloatingTabBar } from '../components/FloatingTabBar';

const USED_GB  = 2.4;
const TOTAL_GB = 16.6;
const USED_PCT = USED_GB / TOTAL_GB;

const APP_BREAKDOWN = [
  { label: 'Recordings', size: '1.8 GB', pct: 0.75, color: colors.foul },
  { label: 'Saved Clips', size: '0.5 GB', pct: 0.20, color: colors.primary },
  { label: 'Thumbnails',  size: '0.1 GB', pct: 0.05, color: colors.offside },
];

export default function SettingsScreen() {
  return (
    <View style={styles.root}>

      {/* ── Top HUD ─────────────────────────────── */}
      <View style={styles.hud}>
        <View style={styles.logoChip}>
          <Image
            source={require('../../assets/images/pocket-var-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.hudCenter}>
          <Text style={styles.hudTitle}>CONFIGURATION</Text>
          <Text style={styles.hudSub}>SYSTEM SETTINGS</Text>
        </View>
        <View style={{ width: 62 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Storage card ───────────────────────── */}
        <View style={styles.sectionLabel}>
          <MaterialCommunityIcons name="harddisk" size={12} color={colors.textSecondary} />
          <Text style={styles.sectionTitle}>STORAGE</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.storageHeader}>
            <Text style={styles.storageUsed}>{USED_GB} GB used</Text>
            <Text style={styles.storageTotal}>of {TOTAL_GB} GB</Text>
          </View>

          {/* Bar */}
          <View style={styles.storageBarTrack}>
            <View
              style={[
                styles.storageBarFill,
                {
                  width: `${USED_PCT * 100}%` as any,
                  backgroundColor:
                    USED_PCT > 0.8 ? colors.redCard :
                    USED_PCT > 0.5 ? colors.foul    :
                    colors.primary,
                },
              ]}
            />
          </View>
          <View style={styles.storageLabels}>
            <Text style={styles.storageBarLabel}>0</Text>
            <Text style={styles.storageBarLabel}>{Math.round(TOTAL_GB / 2)} GB</Text>
            <Text style={styles.storageBarLabel}>{TOTAL_GB} GB</Text>
          </View>

          {/* App breakdown */}
          <View style={styles.divider} />
          <View style={styles.breakdownList}>
            {APP_BREAKDOWN.map((item) => (
              <View key={item.label} style={styles.breakdownRow}>
                <View style={styles.breakdownLeft}>
                  <View style={[styles.breakdownDot, { backgroundColor: item.color }]} />
                  <Text style={styles.breakdownLabel}>{item.label}</Text>
                </View>
                <View style={styles.breakdownBarWrap}>
                  <View style={[styles.breakdownBar, { width: `${item.pct * 100}%` as any, backgroundColor: item.color }]} />
                </View>
                <Text style={styles.breakdownSize}>{item.size}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.7}>
            <MaterialCommunityIcons name="delete-outline" size={14} color={colors.recording} />
            <Text style={styles.deleteBtnText}>DELETE ALL RECORDINGS</Text>
          </TouchableOpacity>
        </View>

        {/* ── Video quality ──────────────────────── */}
        <View style={[styles.sectionLabel, { marginTop: spacing.xl }]}>
          <MaterialCommunityIcons name="video" size={12} color={colors.textSecondary} />
          <Text style={styles.sectionTitle}>VIDEO QUALITY</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Resolution</Text>
            <View style={styles.pillRow}>
              {['720p', '1080p', '4K'].map((q) => (
                <TouchableOpacity
                  key={q}
                  style={[styles.pill, q === '1080p' && styles.pillActive]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pillText, q === '1080p' && styles.pillTextActive]}>
                    {q}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Frame Rate</Text>
            <Text style={styles.cardRowValue}>30 fps</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Format</Text>
            <Text style={styles.cardRowValue}>H.264 / MP4</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Stabilisation</Text>
            <View style={styles.toggleOn}>
              <Text style={styles.toggleOnText}>ON</Text>
            </View>
          </View>
        </View>

        {/* ── Review window ─────────────────────── */}
        <View style={[styles.sectionLabel, { marginTop: spacing.xl }]}>
          <MaterialCommunityIcons name="clock-outline" size={12} color={colors.textSecondary} />
          <Text style={styles.sectionTitle}>REVIEW WINDOW</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Duration</Text>
            <View style={styles.pillRow}>
              {['30s', '60s', '120s'].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.pill, s === '60s' && styles.pillActive]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pillText, s === '60s' && styles.pillTextActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Frame step</Text>
            <Text style={styles.cardRowValue}>33ms (1 frame)</Text>
          </View>
        </View>

        {/* ── Camera ────────────────────────────── */}
        <View style={[styles.sectionLabel, { marginTop: spacing.xl }]}>
          <MaterialCommunityIcons name="camera" size={12} color={colors.textSecondary} />
          <Text style={styles.sectionTitle}>CAMERA</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Facing</Text>
            <View style={styles.pillRow}>
              {['Back', 'Front'].map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.pill, f === 'Back' && styles.pillActive]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pillText, f === 'Back' && styles.pillTextActive]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Auto-save clips</Text>
            <View style={styles.toggleOn}>
              <Text style={styles.toggleOnText}>ON</Text>
            </View>
          </View>
        </View>

        {/* ── About ─────────────────────────────── */}
        <View style={[styles.sectionLabel, { marginTop: spacing.xl }]}>
          <MaterialCommunityIcons name="information-outline" size={12} color={colors.textSecondary} />
          <Text style={styles.sectionTitle}>ABOUT</Text>
        </View>
        <View style={styles.card}>
          {[
            { label: 'Version',    value: '1.0.0 beta' },
            { label: 'SDK',        value: 'Expo 56' },
            { label: 'Developer',  value: 'Nanbol Dassak' },
          ].map((row, i, arr) => (
            <View key={row.label}>
              <View style={styles.cardRow}>
                <Text style={styles.cardRowLabel}>{row.label}</Text>
                <Text style={styles.cardRowValue}>{row.value}</Text>
              </View>
              {i < arr.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* ── Footer ────────────────────────────── */}
        <View style={styles.footer}>
          <Image
            source={require('../../assets/images/varlogo.png')}
            style={styles.footerLogo}
            resizeMode="contain"
          />
          <Text style={styles.footerTag}>Football VAR · Expo SDK 56 · Offline-First</Text>
        </View>

      </ScrollView>

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
    paddingTop: spacing.xxxl + spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  logoChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    width: 62,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 58,
    height: 36,
  },
  hudCenter: {
    alignItems: 'center',
    gap: 1,
  },
  hudTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: colors.text,
  },
  hudSub: {
    fontSize: 7.5,
    fontWeight: '600',
    letterSpacing: 1.8,
    color: colors.textDim,
  },

  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 110,
  },

  // ── Section label
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
    paddingLeft: 2,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: colors.textSecondary,
  },

  // ── Cards
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 13,
  },
  cardRowLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  cardRowValue: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.lg,
  },

  // Storage
  storageHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  storageUsed: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  storageTotal: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textDim,
  },
  storageBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
    marginHorizontal: spacing.lg,
  },
  storageBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  storageLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  storageBarLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: colors.textDim,
  },
  breakdownList: {
    gap: 8,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 90,
  },
  breakdownDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  breakdownLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  breakdownBarWrap: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  breakdownBar: {
    height: '100%',
    borderRadius: 2,
    opacity: 0.7,
  },
  breakdownSize: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textDim,
    width: 44,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 51, 85, 0.06)',
    borderRadius: 0,
    borderBottomLeftRadius: radius.md,
    borderBottomRightRadius: radius.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingVertical: 13,
    paddingHorizontal: spacing.lg,
  },
  deleteBtnText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.recording,
  },

  // Pills
  pillRow: {
    flexDirection: 'row',
    gap: 6,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  pillActive: {
    borderColor: 'rgba(255, 255, 255, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textDim,
  },
  pillTextActive: {
    color: colors.text,
  },

  // Toggle
  toggleOn: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  toggleOnText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.text,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  footerLogo: {
    width: 80,
    height: 80,
    opacity: 0.08,
  },
  footerTag: {
    fontSize: 10,
    color: colors.textDim,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
