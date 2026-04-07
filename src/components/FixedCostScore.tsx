import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../constants/colors';
import { Shadows } from '../constants/shadows';
import { fixedCostScore, scoreColor } from '../utils/calculations';

interface Props {
  fixedTotal: number;
  totalExpense: number;
  monthlyIncome: number;
}

export function FixedCostScore({ fixedTotal, totalExpense, monthlyIncome }: Props) {
  const score = fixedCostScore(fixedTotal, totalExpense, monthlyIncome);
  const color = scoreColor(score);
  const base = monthlyIncome > 0 ? monthlyIncome : totalExpense;
  const ratio = base > 0 ? Math.round((fixedTotal / base) * 100) : 0;

  const size = 180;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  if (totalExpense === 0 && monthlyIncome === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.emptyText}>データを記録するとスコアが表示されます</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.ringContainer}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={Colors.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={strokeDashoffset}
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View style={styles.scoreOverlay}>
          <Text style={[styles.scoreText, { color }]}>{score}</Text>
          <Text style={styles.maxText}>/ 100</Text>
        </View>
      </View>
      <Text style={styles.comparison}>全国平均28%に対して、あなたは{ratio}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    ...Shadows.md,
  },
  ringContainer: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreOverlay: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreText: {
    fontFamily: 'Georgia',
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 52,
  },
  maxText: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  comparison: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textTertiary,
    paddingVertical: 20,
  },
});
