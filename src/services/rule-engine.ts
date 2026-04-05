import { v4 as uuid } from 'uuid';
import type { ActionProposal } from '../models/action-proposal';
import type { Expense } from '../models/expense';
import type { Subscription } from '../models/subscription';
import type { UserProfile } from '../models/user-profile';
import { evidenceSources } from '../constants/evidence-sources';

interface RuleInput {
  expenses: Expense[];
  subscriptions: Subscription[];
  profile: UserProfile;
}

const src = evidenceSources.soumu_kakei_2026_01;

function fmt(n: number): string {
  return n.toLocaleString('ja-JP');
}

export function generateProposal(input: RuleInput): ActionProposal {
  const { expenses, subscriptions, profile } = input;

  const now = new Date();
  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });

  const total = thisMonth.reduce((s, e) => s + e.amount, 0);
  const fixedTotal = thisMonth.filter((e) => e.isFixed).reduce((s, e) => s + e.amount, 0);
  const foodTotal = thisMonth.filter((e) => e.category === 'food').reduce((s, e) => s + e.amount, 0);
  const entTotal = thisMonth.filter((e) => e.category === 'entertainment').reduce((s, e) => s + e.amount, 0);
  const subTotal = subscriptions.filter((s) => s.isActive).reduce((s, sub) => s + sub.monthlyPrice, 0);

  const fixedRatio = total > 0 ? fixedTotal / total : 0;
  const entRatio = total > 0 ? entTotal / total : 0;

  const fundTarget = profile.monthlyExpenseTarget > 0
    ? profile.monthlyExpenseTarget * profile.targetDefenseMonths
    : profile.monthlyIncome * 0.7 * profile.targetDefenseMonths;
  const fundProgress = fundTarget > 0 ? profile.cashBalance / fundTarget : 0;

  const base: Omit<ActionProposal, 'id' | 'createdAt' | 'title' | 'body' | 'trustLevel' | 'applicableScope' | 'expertNote'> = {
    evidenceSource: src.name,
    evidenceUrl: src.url,
    evidenceDate: src.publishedAt,
    isExecuted: false,
  };

  // Rule 1: Fixed costs > 30%
  if (fixedRatio > 0.3 && total > 0) {
    const pct = Math.round(fixedRatio * 100);
    const topFixed = thisMonth
      .filter((e) => e.isFixed)
      .sort((a, b) => b.amount - a.amount)[0];
    const topLabel = topFixed?.label || '固定費';
    const topAmt = topFixed?.amount ?? 0;

    return {
      ...base,
      id: uuid(),
      createdAt: now.toISOString(),
      title: '固定費を1つ見直しましょう',
      body: `固定費が支出の${pct}%を占めています。まずは一番高い${topLabel}（月${fmt(topAmt)}円）の見直しから。`,
      trustLevel: 'high',
      applicableScope: 'あなたの実際の支出データに基づく提案です',
      expertNote: '固定費の見直しは家計改善の基本です。FPへの相談も有効です。',
    };
  }

  // Rule 2: Subscriptions > ¥5,000/month
  if (subTotal > 5000) {
    const annual = subTotal * 12;
    return {
      ...base,
      id: uuid(),
      createdAt: now.toISOString(),
      title: 'サブスクを1つ整理しましょう',
      body: `月${fmt(subTotal)}円のサブスクがあります。使用頻度が低いものを1つ解約するだけで年${fmt(annual)}円の節約に。`,
      trustLevel: 'high',
      applicableScope: 'サブスク合計額に基づく提案です',
      expertNote: 'サブスク棚卸しは最も即効性のある節約法の1つです。',
    };
  }

  // Rule 3: Food > 78,000 × 1.3
  if (foodTotal > 78000 * 1.3) {
    const avgDiff = Math.round(((foodTotal - 78000) / 78000) * 100);
    const weeklyBudget = Math.round(78000 / 4.3);
    return {
      ...base,
      id: uuid(),
      createdAt: now.toISOString(),
      title: '食費を週単位で管理しましょう',
      body: `食費が月${fmt(foodTotal)}円で、同世代平均より${avgDiff}%高めです。週${fmt(weeklyBudget)}円の予算で管理してみましょう。`,
      trustLevel: 'medium',
      applicableScope: '一部のデータに基づく推定を含む提案です',
      expertNote: '食費の管理は週単位が効果的です。無理のない範囲で。',
    };
  }

  // Rule 4: Entertainment > 15%
  if (entRatio > 0.15 && total > 0) {
    return {
      ...base,
      id: uuid(),
      createdAt: now.toISOString(),
      title: '今月の楽しみ方を1つ変えてみましょう',
      body: `娯楽費が支出の${Math.round(entRatio * 100)}%を占めています。無料や低コストの代替を1つ試してみましょう。`,
      trustLevel: 'medium',
      applicableScope: '一部のデータに基づく推定を含む提案です',
      expertNote: '楽しみを「なくす」のではなく「変える」のがポイントです。',
    };
  }

  // Rule 5: Emergency fund < 50%
  if (fundProgress < 0.5 && fundTarget > 0) {
    const monthlyTarget = Math.round((fundTarget - profile.cashBalance) / 6 / 10000);
    return {
      ...base,
      id: uuid(),
      createdAt: now.toISOString(),
      title: `今月は${monthlyTarget > 0 ? monthlyTarget : 1}万円を生活防衛資金に回しましょう`,
      body: `生活防衛資金の進捗は${Math.round(fundProgress * 100)}%です。まずは目標の50%を目指しましょう。`,
      trustLevel: 'high',
      applicableScope: 'あなたの実際の貯蓄データに基づく提案です',
      expertNote: '生活防衛資金は投資の前に確保すべき最優先項目です。',
    };
  }

  // Rule 6: Default
  return {
    ...base,
    id: uuid(),
    createdAt: now.toISOString(),
    title: '支出の記録を続けましょう',
    body: 'データが蓄積されると、より具体的なアドバイスをお届けできます。まずは1週間、毎日の支出を記録してみましょう。',
    trustLevel: 'low',
    applicableScope: '一般的な傾向に基づく参考情報です',
    expertNote: '家計改善の第一歩は「現状把握」です。',
  };
}
