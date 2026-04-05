import { useMemo } from 'react';
import type { Expense } from '../models/expense';
import type { UserProfile } from '../models/user-profile';

export function useWeeklyBudget(profile: UserProfile, currentMonthExpenses: Expense[]) {
  return useMemo(() => {
    const monthlyBudget = profile.monthlyExpenseTarget > 0
      ? profile.monthlyExpenseTarget
      : profile.monthlyIncome > 0
        ? Math.round(profile.monthlyIncome * 0.7)
        : 0;

    if (monthlyBudget <= 0) {
      return { weeklyBudget: 0, weeklySpent: 0, remaining: 0, progress: 0, isLow: false };
    }

    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const weeksInMonth = Math.ceil(daysInMonth / 7);
    const weeklyBudget = Math.round(monthlyBudget / weeksInMonth);

    // Current week start (Monday)
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayOffset);
    weekStart.setHours(0, 0, 0, 0);

    const weeklyExpenses = currentMonthExpenses.filter((e) => {
      return new Date(e.date) >= weekStart;
    });

    const weeklySpent = weeklyExpenses.reduce((s, e) => s + e.amount, 0);
    const remaining = Math.max(weeklyBudget - weeklySpent, 0);
    const progress = weeklyBudget > 0 ? Math.min(weeklySpent / weeklyBudget, 1) : 0;

    return {
      weeklyBudget,
      weeklySpent,
      remaining,
      progress,
      isLow: progress > 0.8,
    };
  }, [profile, currentMonthExpenses]);
}
