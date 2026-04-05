import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { formatNumber } from '../utils/calculations';

interface Props {
  remaining: number;
  weeklyBudget: number;
  progress: number;
  isLow: boolean;
}

export function WeeklyBudget({ remaining, weeklyBudget, progress, isLow }: Props) {
  const barColor = isLow ? Colors.error : Colors.primary;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>
        今週あと{' '}
        <Text style={[styles.amount, { color: barColor }]}>{formatNumber(remaining)}円</Text>
        {' '}使えます
      </Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={styles.footer}>週予算: {formatNumber(weeklyBudget)}円</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 24,
    shadowOpacity: 1,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  amount: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '500',
  },
  barBg: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 6,
  },
});
