import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { Strings } from '../../src/constants/strings';
import { useProfile } from '../../src/hooks/useProfile';
import { useExpenses } from '../../src/hooks/useExpenses';
import { useSubscriptions } from '../../src/hooks/useSubscriptions';
import { useProposal } from '../../src/hooks/useProposal';
import { useExecutions } from '../../src/hooks/useExecutions';
import { useStreak } from '../../src/hooks/useStreak';
import { useWeeklyBudget } from '../../src/hooks/useWeeklyBudget';
import { ActionCard } from '../../src/components/ActionCard';
import { StreakCounter } from '../../src/components/StreakCounter';
import { WeeklyBudget } from '../../src/components/WeeklyBudget';
import { DisclaimerFooter } from '../../src/components/DisclaimerFooter';

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useProfile();
  const { expenses, currentMonthExpenses } = useExpenses();
  const { subscriptions } = useSubscriptions();
  const { currentProposal, generate, markExecuted, canGenerate } = useProposal(
    expenses,
    subscriptions,
    profile,
  );
  const { executions, addExecution } = useExecutions();
  const { streak, streakColor, streakLabel } = useStreak(executions);
  const budget = useWeeklyBudget(profile, currentMonthExpenses);

  const handleDone = async () => {
    if (!currentProposal) return;
    await markExecuted(currentProposal.id);
    await addExecution(currentProposal.id, currentProposal.title);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            こんにちは、{profile.nickname || 'ゲスト'}さん。
          </Text>
          <StreakCounter streak={streak} color={streakColor} label={streakLabel} />
        </View>

        {/* Weekly Budget */}
        {budget.weeklyBudget > 0 && (
          <WeeklyBudget
            remaining={budget.remaining}
            weeklyBudget={budget.weeklyBudget}
            progress={budget.progress}
            isLow={budget.isLow}
          />
        )}

        {/* Action Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{Strings.thisMonthAction}</Text>
          {currentProposal ? (
            <ActionCard
              proposal={currentProposal}
              onDone={currentProposal.isExecuted ? undefined : handleDone}
              onDetail={() => router.push({ pathname: '/detail', params: { id: currentProposal.id } })}
            />
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>{Strings.noProposal}</Text>
              {canGenerate && (
                <Pressable style={styles.generateButton} onPress={generate}>
                  <Text style={styles.generateText}>{Strings.generateProposal}</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>

        {/* Quick Add */}
        <Pressable style={styles.addButton} onPress={() => router.push('/add-expense')}>
          <Text style={styles.addButtonText}>{Strings.addExpense}</Text>
        </Pressable>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textHint,
  },
  generateButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  generateText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});
