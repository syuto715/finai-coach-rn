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

  return (
    <View style={styles.card}>
      <Text style={styles.title}>固定費スコア</Text>
      <View style={styles.ringContainer}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color + '26'}
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
      <View style={styles.badge}>
        <Text style={styles.badgeIcon}>ℹ️</Text>
        <Text style={styles.badgeText}>参考：総務省 家計調査</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
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
    fontSize: 48,
    fontWeight: '900',
  },
  maxText: {
    fontSize: 12,
    color: Colors.textHint,
  },
  comparison: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
    gap: 4,
  },
  badgeIcon: {
    fontSize: 10,
  },
  badgeText: {
    fontSize: 10,
    color: Colors.textHint,
  },
});
