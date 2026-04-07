import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Colors } from '../../src/constants/colors';
import { Shadows } from '../../src/constants/shadows';
import { useProfile } from '../../src/hooks/useProfile';
import { useExpenses } from '../../src/hooks/useExpenses';
import { useCategories } from '../../src/hooks/useCategories';
import { FixedCostScore } from '../../src/components/FixedCostScore';
import { SectionHeader } from '../../src/components/SectionHeader';
import { DisclaimerFooter } from '../../src/components/DisclaimerFooter';
import { EmptyState } from '../../src/components/EmptyState';
import { formatNumber } from '../../src/utils/calculations';

const screenWidth = Dimensions.get('window').width - 80;

const chartColors = [
  Colors.secondary, '#2196F3', Colors.primary, '#9C27B0',
  '#00BCD4', '#795548', '#607D8B', Colors.warning,
];

export default function AnalysisScreen() {
  const { profile, reload: reloadProfile } = useProfile();
  const { expenses, currentMonthExpenses, categoryTotals, totalThisMonth, fixedThisMonth, reload: reloadExpenses } = useExpenses();
  const { getCategoryName } = useCategories();

  useFocusEffect(
    useCallback(() => {
      reloadProfile();
      reloadExpenses();
    }, [reloadProfile, reloadExpenses]),
  );

  // Past 3 months bar data
  const now = new Date();
  const past3 = [2, 1, 0].map((offset) => {
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const monthExpenses = expenses.filter((e) => {
      const ed = new Date(e.date);
      return ed.getFullYear() === d.getFullYear() && ed.getMonth() === d.getMonth();
    });
    return {
      label: `${d.getMonth() + 1}月`,
      total: monthExpenses.reduce((s, e) => s + e.amount, 0),
    };
  });

  const barData = {
    labels: past3.map((m) => m.label),
    datasets: [{ data: past3.map((m) => m.total || 0) }],
  };

  // Pie data
  const catEntries = Object.entries(categoryTotals)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a);

  const pieData = catEntries.map(([key, value], i) => ({
    name: getCategoryName(key),
    amount: value,
    color: chartColors[i % chartColors.length],
    legendFontColor: Colors.textSecondary,
    legendFontSize: 11,
  }));

  const hasData = totalThisMonth > 0 || expenses.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Page Title */}
        <Text style={styles.pageTitle}>分析</Text>

        {!hasData ? (
          <EmptyState
            emoji="📊"
            title="まだデータがありません"
            description="支出を記録すると分析が表示されます"
          />
        ) : (
          <>
            {/* Fixed Cost Score */}
            <FixedCostScore
              fixedTotal={fixedThisMonth}
              totalExpense={totalThisMonth}
              monthlyIncome={profile.monthlyIncome}
            />

            {/* Category Spending */}
            <View style={styles.card}>
              <SectionHeader title="カテゴリ別支出" />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>今月の合計</Text>
                <Text style={styles.totalValue}>¥{formatNumber(totalThisMonth)}</Text>
              </View>
              {pieData.length > 0 ? (
                <PieChart
                  data={pieData}
                  width={screenWidth}
                  height={200}
                  accessor="amount"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  chartConfig={{
                    color: () => Colors.primary,
                  }}
                />
              ) : (
                <Text style={styles.emptyText}>データがありません</Text>
              )}
              {/* Legend */}
              {catEntries.map(([key, value], i) => (
                <View key={key} style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: chartColors[i % chartColors.length] }]} />
                  <Text style={styles.legendName}>{getCategoryName(key)}</Text>
                  <Text style={styles.legendAmount}>¥{formatNumber(value)}</Text>
                  <Text style={styles.legendPct}>
                    {Math.round((value / totalThisMonth) * 100)}%
                  </Text>
                </View>
              ))}
            </View>

            {/* Spending Trend */}
            <View style={styles.card}>
              <SectionHeader title="過去の推移" />
              {past3.some((m) => m.total > 0) ? (
                <BarChart
                  data={barData}
                  width={screenWidth}
                  height={180}
                  yAxisLabel="¥"
                  yAxisSuffix=""
                  chartConfig={{
                    backgroundColor: Colors.surface,
                    backgroundGradientFrom: Colors.surface,
                    backgroundGradientTo: Colors.surface,
                    decimalPlaces: 0,
                    color: (opacity, index) => index === 2 ? Colors.secondary : Colors.borderStrong,
                    labelColor: () => Colors.textSecondary,
                    barPercentage: 0.6,
                  }}
                  style={{ borderRadius: 12 }}
                />
              ) : (
                <Text style={styles.emptyText}>データがありません</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
      <DisclaimerFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    gap: 20,
    paddingBottom: 24,
  },
  pageTitle: {
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    ...Shadows.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textTertiary,
    paddingVertical: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendName: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  legendAmount: {
    fontFamily: 'Georgia',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  legendPct: {
    fontSize: 13,
    color: Colors.textTertiary,
    width: 36,
    textAlign: 'right',
  },
});
