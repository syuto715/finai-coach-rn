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
  const color = isLow ? Colors.error : Colors.primary;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📅</Text>
        <Text style={styles.headerText}>今週の予算</Text>
      </View>
      <Text style={styles.label}>
        今週あと{' '}
        <Text style={[styles.amount, { color }]}>{formatNumber(remaining)}円</Text>
        {' '}使えます
      </Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.footer}>週予算: {formatNumber(weeklyBudget)}円</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  headerIcon: {
    fontSize: 14,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  amount: {
    fontSize: 20,
    fontWeight: '900',
  },
  barBg: {
    height: 8,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    fontSize: 12,
    color: Colors.textHint,
    marginTop: 6,
  },
});
