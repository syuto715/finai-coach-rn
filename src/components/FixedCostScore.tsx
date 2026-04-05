import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../constants/colors';
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

  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  if (totalExpense === 0 && monthlyIncome === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>固定費スコア</Text>
        <Text style={styles.emptyText}>データを記録するとスコアが表示されます</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>固定費スコア</Text>
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
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 24,
    shadowOpacity: 1,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 16,
  },
  ringContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreOverlay: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreText: {
    fontFamily: 'Georgia',
    fontSize: 40,
    fontWeight: '500',
  },
  maxText: {
    fontSize: 12,
    color: Colors.textTertiary,
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
