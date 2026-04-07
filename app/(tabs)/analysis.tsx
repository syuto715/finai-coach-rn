import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Colors } from '../../src/constants/colors';
import { Strings } from '../../src/constants/strings';
import { useProfile } from '../../src/hooks/useProfile';
import { useExpenses } from '../../src/hooks/useExpenses';
import { useCategories } from '../../src/hooks/useCategories';
import { FixedCostScore } from '../../src/components/FixedCostScore';
import { EvidenceCard } from '../../src/components/EvidenceCard';
import { DisclaimerFooter } from '../../src/components/DisclaimerFooter';
import { formatNumber } from '../../src/utils/calculations';
import { evidenceSources } from '../../src/constants/evidence-sources';

const screenWidth = Dimensions.get('window').width - 80;

const chartColors = [
  Colors.primary, '#2196F3', Colors.secondary, Colors.error,
  '#9C27B0', '#00BCD4', '#795548', '#607D8B',
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

  // Pie data - use dynamic category names
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

  // Fixed cost list
  const fixedExpenses = currentMonthExpenses.filter((e) => e.isFixed);

  const src = evidenceSources.soumu_kakei_2026_01;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Fixed Cost Score */}
        <FixedCostScore
          fixedTotal={fixedThisMonth}
          totalExpense={totalThisMonth}
          monthlyIncome={profile.monthlyIncome}
        />

        {/* Bar Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>過去3ヶ月の推移</Text>
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
                color: () => Colors.primary,
                labelColor: () => Colors.textSecondary,
                barPercentage: 0.6,
              }}
              style={{ borderRadius: 12 }}
            />
          ) : (
            <Text style={styles.emptyText}>データがありません</Text>
          )}
        </View>

        {/* Pie Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{Strings.byCategory}</Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{Strings.totalExpense}</Text>
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
        </View>

        {/* Fixed Cost List */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>固定費一覧</Text>
          {fixedExpenses.length === 0 ? (
            <Text style={styles.emptyText}>固定費データがありません</Text>
          ) : (
            <>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>固定費合計</Text>
                <Text style={styles.totalValue}>¥{formatNumber(fixedThisMonth)}</Text>
              </View>
              {fixedExpenses.map((e) => (
                <View key={e.id} style={styles.fixedRow}>
                  <Text style={styles.fixedLabel}>{e.label || getCategoryName(e.category)}</Text>
                  <Text style={styles.fixedAmount}>¥{formatNumber(e.amount)}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Evidence */}
        <EvidenceCard
          sourceName={src.name}
          publishedAt={src.publishedAt}
          url={src.url}
        />
      </ScrollView>
      <DisclaimerFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    gap: 12,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 24,
    shadowOpacity: 1,
  },
  cardTitle: {
    fontFamily: 'Georgia',
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontFamily: 'Georgia',
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textTertiary,
    paddingVertical: 8,
  },
  fixedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  fixedLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  fixedAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
});
