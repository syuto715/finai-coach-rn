import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Colors } from '../../src/constants/colors';
import { Strings } from '../../src/constants/strings';
import { useProfile } from '../../src/hooks/useProfile';
import { useExpenses } from '../../src/hooks/useExpenses';
import { FixedCostScore } from '../../src/components/FixedCostScore';
import { DisclaimerFooter } from '../../src/components/DisclaimerFooter';
import { formatNumber, formatMonthJP } from '../../src/utils/calculations';
import { evidenceSources } from '../../src/constants/evidence-sources';

const screenWidth = Dimensions.get('window').width - 72;

const chartColors = [
  Colors.primary, '#2196F3', Colors.secondary, Colors.error,
  '#9C27B0', '#00BCD4', '#795548', '#607D8B',
];

export default function AnalysisScreen() {
  const { profile } = useProfile();
  const { expenses, currentMonthExpenses, categoryTotals, totalThisMonth, fixedThisMonth } = useExpenses();

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
    name: Strings.categories[key] ?? key,
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
            <Text style={styles.emptyText}>固定費データがありません。支出入力時に「固定費」フラグを設定してください。</Text>
          ) : (
            <>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>固定費合計</Text>
                <Text style={styles.totalValue}>¥{formatNumber(fixedThisMonth)}</Text>
              </View>
              {fixedExpenses.map((e) => (
                <View key={e.id} style={styles.fixedRow}>
                  <Text style={styles.fixedLabel}>{e.label || (Strings.categories[e.category] ?? e.category)}</Text>
                  <Text style={styles.fixedAmount}>¥{formatNumber(e.amount)}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Evidence */}
        <View style={styles.evidenceBox}>
          <Text style={styles.evidenceIcon}>ℹ️</Text>
          <View style={styles.evidenceContent}>
            <Text style={styles.evidenceTitle}>参考統計：{src.name}</Text>
            <Text style={styles.evidenceDesc}>
              2人以上世帯の平均月支出は約28万円（食費・住居・光熱費含む）。
              カテゴリ別平均との比較でムダを特定します。
            </Text>
          </View>
        </View>
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
    padding: 16,
    gap: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
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
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  emptyText: {
    fontSize: 12,
    color: Colors.textHint,
  },
  fixedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
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
  evidenceBox: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary + '26',
    padding: 14,
    gap: 8,
  },
  evidenceIcon: {
    fontSize: 14,
  },
  evidenceContent: {
    flex: 1,
    gap: 2,
  },
  evidenceTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  evidenceDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
