import React, { useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../../src/constants/colors';
import { Shadows } from '../../src/constants/shadows';
import { Strings } from '../../src/constants/strings';
import { useProfile } from '../../src/hooks/useProfile';
import { useExpenses } from '../../src/hooks/useExpenses';
import { useSubscriptions } from '../../src/hooks/useSubscriptions';
import { useCategories } from '../../src/hooks/useCategories';
import { useProposal } from '../../src/hooks/useProposal';
import { useExecutions } from '../../src/hooks/useExecutions';
import { useStreak } from '../../src/hooks/useStreak';
import { useWeeklyBudget } from '../../src/hooks/useWeeklyBudget';
import { useChallenge } from '../../src/hooks/useChallenge';
import { useSavingsTracker } from '../../src/hooks/useSavingsTracker';
import { ActionCard } from '../../src/components/ActionCard';
import { StreakCounter } from '../../src/components/StreakCounter';
import { WeeklyBudget } from '../../src/components/WeeklyBudget';
import { DisclaimerFooter } from '../../src/components/DisclaimerFooter';
import { EmptyState } from '../../src/components/EmptyState';
import { Button } from '../../src/components/Button';
import { formatNumber, totalAmount, getMonthExpenses } from '../../src/utils/calculations';
import { getPresetForProposal } from '../../src/constants/savings-presets';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const router = useRouter();
  const { profile, reload: reloadProfile } = useProfile();
  const { expenses, currentMonthExpenses, reload: reloadExpenses } = useExpenses();
  const { subscriptions, reload: reloadSubscriptions } = useSubscriptions();
  const { categories } = useCategories();
  const { currentProposal, generate, markExecuted, canGenerate, reload: reloadProposals } = useProposal(
    expenses,
    subscriptions,
    profile,
    categories,
  );
  const { executions, addExecution, reload: reloadExecutions } = useExecutions();
  const { streak, streakColor, streakLabel } = useStreak(executions);
  const budget = useWeeklyBudget(profile, currentMonthExpenses);
  const { challenge, startNewChallenge, recordProgress, reload: reloadChallenge } = useChallenge();
  const { totalEstimatedSavings, addSavingsAchievement, reload: reloadSavings } = useSavingsTracker();

  useFocusEffect(
    useCallback(() => {
      reloadProfile();
      reloadExpenses();
      reloadSubscriptions();
      reloadProposals();
      reloadExecutions();
      reloadChallenge();
      reloadSavings();
    }, [reloadProfile, reloadExpenses, reloadSubscriptions, reloadProposals, reloadExecutions, reloadChallenge, reloadSavings]),
  );

  const handleDone = async () => {
    if (!currentProposal) return;
    await markExecuted(currentProposal.id);
    await addExecution(currentProposal.id, currentProposal.title);
    const preset = getPresetForProposal(currentProposal.title);
    await addSavingsAchievement(currentProposal.id, currentProposal.title, preset.monthlySaving);
  };

  const handleChallengeRecord = async () => {
    if (!challenge) return;
    await recordProgress();
    if (challenge.currentValue + 1 >= challenge.targetValue && challenge.unit !== '円') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const hasExpenses = currentMonthExpenses.length > 0;

  // Monthly summary
  const monthTotal = currentMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const now = new Date();
  const lastMonth = getMonthExpenses(
    expenses,
    now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear(),
    now.getMonth() === 0 ? 11 : now.getMonth() - 1,
  );
  const lastMonthTotal = totalAmount(lastMonth);
  const monthDiff = monthTotal - lastMonthTotal;

  // Mini bar chart data (past 4 weeks)
  const weekTotals = [3, 2, 1, 0].map((weeksAgo) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (weeksAgo + 1) * 7);
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() - weeksAgo * 7);
    return currentMonthExpenses
      .filter((e) => {
        const d = new Date(e.date);
        return d >= weekStart && d < weekEnd;
      })
      .reduce((s, e) => s + e.amount, 0);
  });
  const maxWeek = Math.max(...weekTotals, 1);

  // Date display
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const dateStr = `${now.getMonth() + 1}月${now.getDate()}日 ${days[now.getDay()]}曜日`;

  // Challenge progress ring
  const challengeProgress = challenge
    ? Math.min(challenge.currentValue / Math.max(challenge.targetValue, 1), 1)
    : 0;
  const ringSize = 40;
  const ringStroke = 4;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* 1. Greeting Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              こんにちは、{profile.nickname || 'ゲスト'}さん
            </Text>
            <Text style={styles.dateText}>{dateStr}</Text>
          </View>
          <StreakCounter streak={streak} color={streakColor} label={streakLabel} />
        </View>

        {/* 2. Monthly Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryLabel}>今月の支出</Text>
            <Text style={styles.summaryAmount}>¥{formatNumber(monthTotal)}</Text>
            {lastMonthTotal > 0 && (
              <Text style={[styles.summaryDiff, { color: monthDiff > 0 ? Colors.error : Colors.success }]}>
                先月比 {monthDiff > 0 ? '+' : ''}¥{formatNumber(monthDiff)}
              </Text>
            )}
            {totalEstimatedSavings > 0 && (
              <Text style={styles.savingsText}>
                推定 ¥{formatNumber(totalEstimatedSavings)} の節約を達成
              </Text>
            )}
          </View>
          <View style={styles.miniChart}>
            {weekTotals.map((w, i) => (
              <View key={i} style={styles.miniBarContainer}>
                <View
                  style={[
                    styles.miniBar,
                    {
                      height: Math.max((w / maxWeek) * 40, 2),
                      backgroundColor: i === 3 ? Colors.secondary : Colors.border,
                    },
                  ]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* 3. Weekly Budget Bar */}
        {budget.weeklyBudget > 0 ? (
          <WeeklyBudget
            remaining={budget.remaining}
            weeklyBudget={budget.weeklyBudget}
            progress={budget.progress}
            isLow={budget.isLow}
          />
        ) : !hasExpenses ? (
          <EmptyState
            emoji="📝"
            title="支出を記録しましょう"
            description="支出を記録すると予算管理が始まります"
            ctaLabel="＋ 支出を記録"
            onCta={() => router.push('/add-expense')}
          />
        ) : null}

        {/* 4. Action Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{Strings.thisMonthAction}</Text>
          {currentProposal ? (
            <ActionCard
              proposal={currentProposal}
              onDone={currentProposal.isExecuted ? undefined : handleDone}
              onDetail={() => router.push({ pathname: '/detail', params: { id: currentProposal.id } })}
              onSimulate={currentProposal.isExecuted ? undefined : () =>
                router.push({ pathname: '/savings-simulator', params: { title: currentProposal.title } })
              }
            />
          ) : (
            <View style={styles.emptyCard}>
              {!hasExpenses ? (
                <Text style={styles.emptyText}>まず支出を記録しましょう</Text>
              ) : (
                <>
                  <Text style={styles.emptyText}>{Strings.noProposal}</Text>
                  {canGenerate && (
                    <Button title={Strings.generateProposal} onPress={generate} size="md" />
                  )}
                </>
              )}
            </View>
          )}
        </View>

        {/* 5. Challenge Card */}
        {challenge ? (
          <View style={[styles.challengeCard, challenge.isCompleted && styles.challengeCardCompleted]}>
            <View style={styles.challengeContent}>
              <View style={styles.challengeRing}>
                <Svg width={ringSize} height={ringSize}>
                  <Circle cx={ringSize / 2} cy={ringSize / 2} r={ringRadius}
                    stroke={Colors.border} strokeWidth={ringStroke} fill="none" />
                  <Circle cx={ringSize / 2} cy={ringSize / 2} r={ringRadius}
                    stroke={challenge.isCompleted ? Colors.success : Colors.secondary}
                    strokeWidth={ringStroke} fill="none" strokeLinecap="round"
                    strokeDasharray={`${ringCircumference}`}
                    strokeDashoffset={ringCircumference - challengeProgress * ringCircumference}
                    rotation="-90" origin={`${ringSize / 2}, ${ringSize / 2}`} />
                </Svg>
              </View>
              <View style={styles.challengeInfo}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={styles.challengeProgress}>
                  {challenge.currentValue}/{challenge.targetValue} {challenge.unit}
                </Text>
              </View>
              {challenge.isCompleted ? (
                <View style={styles.challengeComplete}>
                  <Text style={styles.challengeCompleteText}>🎉 達成！</Text>
                </View>
              ) : (
                <Pressable style={styles.challengeRecordBtn} onPress={handleChallengeRecord}>
                  <Text style={styles.challengeRecordText}>記録</Text>
                </Pressable>
              )}
            </View>
            {challenge.isCompleted && (
              <Button
                title="次のチャレンジ"
                variant="primary"
                size="sm"
                onPress={startNewChallenge}
                style={styles.nextChallengeBtn}
              />
            )}
          </View>
        ) : (
          <Pressable style={styles.startChallengeCard} onPress={startNewChallenge}>
            <Text style={styles.startChallengeEmoji}>🏆</Text>
            <Text style={styles.startChallengeText}>週間チャレンジを始める</Text>
          </Pressable>
        )}

        {/* 6. Quick Actions */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActions}>
          <Pressable style={styles.quickAction} onPress={() => router.push('/add-expense')}>
            <View style={styles.quickActionCircle}>
              <Text style={styles.quickActionIcon}>＋</Text>
            </View>
            <Text style={styles.quickActionLabel}>支出を記録</Text>
          </Pressable>
          <Pressable style={styles.quickAction} onPress={() => router.push('/(tabs)/analysis')}>
            <View style={styles.quickActionCircle}>
              <Text style={styles.quickActionIcon}>📊</Text>
            </View>
            <Text style={styles.quickActionLabel}>分析を見る</Text>
          </Pressable>
          <Pressable style={styles.quickAction} onPress={() => router.push('/(tabs)/subscriptions')}>
            <View style={styles.quickActionCircle}>
              <Text style={styles.quickActionIcon}>🔄</Text>
            </View>
            <Text style={styles.quickActionLabel}>サブスク確認</Text>
          </Pressable>
        </ScrollView>

        {/* 7. Monthly Report Link */}
        <Pressable onPress={() => router.push('/monthly-report')}>
          <Text style={styles.reportLink}>📄 先月のレポートを見る</Text>
        </Pressable>

        {/* 8. DisclaimerFooter inline */}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  dateText: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 4,
  },

  // Monthly Summary
  summaryCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadows.md,
  },
  summaryLeft: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  summaryAmount: {
    fontFamily: 'Georgia',
    fontSize: 36,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 40,
    letterSpacing: -0.5,
    marginTop: 4,
  },
  summaryDiff: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  savingsText: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: '600',
    marginTop: 6,
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 40,
  },
  miniBarContainer: {
    justifyContent: 'flex-end',
    height: 40,
  },
  miniBar: {
    width: 12,
    borderRadius: 3,
  },

  // Sections
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 16,
    ...Shadows.sm,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textTertiary,
  },

  // Challenge
  challengeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    ...Shadows.sm,
  },
  challengeCardCompleted: {
    backgroundColor: Colors.successLight,
  },
  challengeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  challengeRing: {
    width: 40,
    height: 40,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  challengeProgress: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  challengeRecordBtn: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  challengeRecordText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  challengeComplete: {
    paddingHorizontal: 12,
  },
  challengeCompleteText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.success,
  },
  nextChallengeBtn: {
    marginTop: 12,
    alignSelf: 'center',
  },
  startChallengeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  startChallengeEmoji: {
    fontSize: 20,
  },
  startChallengeText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.secondary,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: 20,
    paddingVertical: 4,
  },
  quickAction: {
    alignItems: 'center',
    gap: 6,
  },
  quickActionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  quickActionIcon: {
    fontSize: 22,
  },
  quickActionLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  // Report link
  reportLink: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.secondary,
    textAlign: 'center',
    paddingVertical: 8,
  },
});
