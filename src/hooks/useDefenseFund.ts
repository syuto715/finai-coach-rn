import { useMemo } from 'react';
import type { UserProfile } from '../models/user-profile';
import { fundProgressRatio, meterColor, fundAdvice, toMan } from '../utils/calculations';

export function useDefenseFund(profile: UserProfile) {
  const target = useMemo(() => {
    const monthlyExpense = profile.monthlyExpenseTarget > 0
      ? profile.monthlyExpenseTarget
      : profile.monthlyIncome > 0
        ? Math.round(profile.monthlyIncome * 0.8)
        : 0;
    return monthlyExpense * profile.targetDefenseMonths;
  }, [profile.monthlyExpenseTarget, profile.monthlyIncome, profile.targetDefenseMonths]);

  const ratio = fundProgressRatio(profile.cashBalance, target);
  const color = meterColor(ratio);
  const advice = fundAdvice(ratio);
  const remaining = Math.max(target - profile.cashBalance, 0);

  const simulation = useMemo(() => {
    if (target <= 0 || remaining <= 0) return null;
    const monthlySaving = 30000;
    const months = Math.ceil(remaining / monthlySaving);
    const achieveDate = new Date();
    achieveDate.setMonth(achieveDate.getMonth() + months);
    return { months, achieveDate, monthlySaving };
  }, [target, remaining]);

  return {
    target,
    current: profile.cashBalance,
    ratio,
    color,
    advice,
    remaining,
    targetLabel: toMan(target),
    currentLabel: toMan(profile.cashBalance),
    simulation,
  };
}
