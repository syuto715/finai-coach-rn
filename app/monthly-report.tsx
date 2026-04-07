import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../src/constants/colors';
import { Shadows } from '../src/constants/shadows';
import { Button } from '../src/components/Button';
import { useExpenses } from '../src/hooks/useExpenses';
import { useExecutions } from '../src/hooks/useExecutions';
import { useProfile } from '../src/hooks/useProfile';
import { useCategories } from '../src/hooks/useCategories';
import { formatNumber, getMonthExpenses, categoryTotals, totalAmount, fixedCostScore } from '../src/utils/calculations';

export default function MonthlyReportScreen() {
  const router = useRouter();
  const { expenses } = useExpenses();
  const { executions } = useExecutions();
  const { profile } = useProfile();
  const { getCategoryName } = useCategories();

  const now = new Date();
  const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const twoMonthsAgo = lastMonth === 0 ? 11 : lastMonth - 1;
  const twoMonthsAgoYear = lastMonth === 0 ? lastMonthYear - 1 : lastMonthYear;

  const lastMonthExpenses = getMonthExpenses(expenses, lastMonthYear, lastMonth);
  const prevMonthExpenses = getMonthExpenses(expenses, twoMonthsAgoYear, twoMonthsAgo);

  const lastTotal = totalAmount(lastMonthExpenses);
  const prevTotal = totalAmount(prevMonthExpenses);
  const diff = lastTotal - prevTotal;

  // Category changes
  const lastCatTotals = categoryTotals(lastMonthExpenses);
  const prevCatTotals = categoryTotals(prevMonthExpenses);
  const allCats = [...new Set([...Object.keys(lastCatTotals), ...Object.keys(prevCatTotals)])];
  const catChanges = allCats.map((cat) => ({
    category: cat,
    last: lastCatTotals[cat] ?? 0,
    prev: prevCatTotals[cat] ?? 0,
    diff: (lastCatTotals[cat] ?? 0) - (prevCatTotals[cat] ?? 0),
  })).sort((a, b) => b.diff - a.diff);

  const increased = catChanges.filter((c) => c.diff > 0);
  const decreased = catChanges.filter((c) => c.diff < 0);

  // Executions count for last month
  const lastMonthExecs = executions.filter((e) => {
    const d = new Date(e.executedAt);
    return d.getFullYear() === lastMonthYear && d.getMonth() === lastMonth;
  });

  // Fixed cost score
  const lastFixed = lastMonthExpenses.filter((e) => e.isFixed).reduce((s, e) => s + e.amount, 0);
  const fScore = fixedCostScore(lastFixed, lastTotal, profile.monthlyIncome);

  const monthLabel = `${lastMonth + 1}月`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={styles.heading}>{monthLabel}のレポート</Text>

      {lastMonthExpenses.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>📄</Text>
          <Text style={styles.emptyTitle}>先月のデータがありません</Text>
          <Text style={styles.emptyDesc}>支出を記録するとレポートが生成されます</Text>
        </View>
      ) : (
        <>
          {/* Score Cards */}
          <View style={styles.scoreRow}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>総支出</Text>
              <Text style={styles.scoreValue}>¥{formatNumber(lastTotal)}</Text>
              {prevTotal > 0 && (
                <Text style={[styles.scoreDiff, { color: diff > 0 ? Colors.error : Colors.success }]}>
                  {diff > 0 ? '+' : ''}¥{formatNumber(diff)}
                </Text>
              )}
            </View>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>実行数</Text>
              <Text style={styles.scoreValue}>{lastMonthExecs.length}回</Text>
            </View>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>固定費率</Text>
              <Text style={styles.scoreValue}>{lastTotal > 0 ? Math.round((lastFixed / lastTotal) * 100) : 0}%</Text>
            </View>
          </View>

          {/* Category Changes */}
          {(increased.length > 0 || decreased.length > 0) && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>カテゴリ変化</Text>
              {increased.slice(0, 3).map((c) => (
                <View key={c.category} style={styles.catRow}>
                  <Text style={styles.catIcon}>🔴</Text>
                  <Text style={styles.catName}>{getCategoryName(c.category)}</Text>
                  <Text style={styles.catDiffUp}>+¥{formatNumber(c.diff)}</Text>
                </View>
              ))}
              {decreased.slice(0, 3).map((c) => (
                <View key={c.category} style={styles.catRow}>
                  <Text style={styles.catIcon}>🟢</Text>
                  <Text style={styles.catName}>{getCategoryName(c.category)}</Text>
                  <Text style={styles.catDiffDown}>-¥{formatNumber(Math.abs(c.diff))}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Advice Card */}
          <View style={styles.adviceCard}>
            <View style={styles.adviceAccent} />
            <Text style={styles.adviceTitle}>来月のアドバイス</Text>
            <Text style={styles.adviceText}>
              {fScore >= 70
                ? '固定費は良好です。変動費の最適化に取り組みましょう。'
                : fScore >= 40
                  ? '固定費を少し見直すと大きな効果があります。一番高い固定費から検討しましょう。'
                  : '固定費の見直しが最優先です。携帯代や保険の見直しから始めてみましょう。'
              }
            </Text>
          </View>
        </>
      )}

      {/* Close Button */}
      <Button
        title="閉じる"
        variant="secondary"
        size="lg"
        onPress={() => router.back()}
      />
    </ScrollView>
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
    paddingBottom: 40,
  },
  heading: {
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: 'Georgia',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 15,
    color: Colors.textTertiary,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 10,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    ...Shadows.sm,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  scoreValue: {
    fontFamily: 'Georgia',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 4,
  },
  scoreDiff: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 10,
    ...Shadows.sm,
  },
  cardTitle: {
    fontFamily: 'Georgia',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  catIcon: {
    fontSize: 14,
  },
  catName: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  catDiffUp: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
  },
  catDiffDown: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
  },
  adviceCard: {
    backgroundColor: Colors.secondaryLight,
    borderRadius: 16,
    padding: 20,
    paddingLeft: 24,
    gap: 6,
  },
  adviceAccent: {
    position: 'absolute',
    left: 0,
    top: 16,
    bottom: 16,
    width: 4,
    borderRadius: 2,
    backgroundColor: Colors.secondary,
  },
  adviceTitle: {
    fontFamily: 'Georgia',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  adviceText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
