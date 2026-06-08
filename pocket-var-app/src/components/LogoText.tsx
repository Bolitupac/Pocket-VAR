import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

/**
 * LogoText — pure-text Pocket VAR wordmark.
 *
 * Replicates the Canva Sans logotype using system bold sans-serif
 * (800 weight, wide tracking). No PNG, no SVG — just text that
 * scales perfectly at any size.
 *
 * Props:
 *  - variant: 'full' → "POCKET VAR"   (headers, splash)
 *             'short' → "VAR"          (watermarks, badges)
 *  - size:     'sm' | 'md' | 'lg'
 *  - color:    any colour token, defaults to white
 */

type LogoTextProps = {
  variant?: 'full' | 'short';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
};

const sizeMap = {
  sm: { full: 16, short: 22 },
  md: { full: 22, short: 30 },
  lg: { full: 28, short: 38 },
};

export function LogoText({
  variant = 'full',
  size = 'md',
  color = colors.text,
}: LogoTextProps) {
  const text = variant === 'full' ? 'POCKET VAR' : 'VAR';
  const fontSize = sizeMap[size][variant];

  return (
    <Text style={[styles.root, { fontSize, color }]}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  root: {
    ...typography.logo,
  },
});
