import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { Colors } from '../constants/colors';
import { Shadows } from '../constants/shadows';

interface Props {
  variant?: 'default' | 'elevated' | 'outlined' | 'accent';
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ variant = 'default', children, style }: Props) {
  return (
    <View style={[styles.base, variantStyles[variant], style]}>
      {variant === 'accent' && <View style={styles.accentLine} />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    padding: 20,
  },
  accentLine: {
    position: 'absolute',
    left: 0,
    top: 16,
    bottom: 16,
    width: 4,
    borderRadius: 2,
    backgroundColor: Colors.secondary,
  },
});

const variantStyles: Record<string, ViewStyle> = {
  default: {
    backgroundColor: Colors.surface,
    ...Shadows.sm,
  },
  elevated: {
    backgroundColor: Colors.surfaceElevated,
    ...Shadows.md,
  },
  outlined: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  accent: {
    backgroundColor: Colors.secondaryLight,
    paddingLeft: 24,
  },
};
