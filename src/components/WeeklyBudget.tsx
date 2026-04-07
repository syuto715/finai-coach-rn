import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Shadows } from '../constants/shadows';
import { formatNumber } from '../utils/calculations';

interface Props {
  remaining: number;
  weeklyBudget: number;
  progress: number;
  isLow: boolean;
}

export function WeeklyBudget({ remaining, weeklyBudget, progress, isLow }: Props) {
  const barColor = isLow ? Colors.error : Colors.success;
  const spent = weeklyBudget - remaining;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>今週の残り</Text>
      <Text style={[styles.amount, { color: isLow ? Colors.error : Colors.text }]}>
        ¥{formatNumber(Math.max(0, remaining))}
      </Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={styles.footer}>¥{formatNumber(spent > 0 ? spent : 0)} / ¥{formatNumber(weeklyBudget)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    ...Shadows.sm,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  amount: {
    fontFamily: 'Georgia',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  barBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  footer: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 8,
  },
});
