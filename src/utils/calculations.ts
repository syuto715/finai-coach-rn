import type { Expense, CategoryType } from '../models/expense';

/** Format number with Japanese comma grouping */
export function formatYen(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`;
}

/** Format number without yen sign */
export function formatNumber(amount: number): string {
  return amount.toLocaleString('ja-JP');
}

/** Convert to 万円 display */
export function toMan(amount: number): string {
  if (amount === 0) return '0円';
  const man = Math.floor(amount / 10000);
  const remainder = amount % 10000;
  if (remainder === 0) return `${man}万円`;
  return `${man}万${formatNumber(remainder)}円`;
}

/** Get expenses for a specific month */
export function getMonthExpenses(expenses: Expense[], year: number, month: number): Expense[] {
  return expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

/** Sum expenses by category */
export function categoryTotals(expenses: Expense[]): Record<CategoryType, number> {
  const totals: Record<string, number> = {};
  for (const e of expenses) {
    totals[e.category] = (totals[e.category] ?? 0) + e.amount;
  }
  return totals as Record<CategoryType, number>;
}

/** Total amount of expense array */
export function totalAmount(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

/** Fixed cost score (0-100) based on ratio */
export function fixedCostScore(fixedTotal: number, totalExpense: number, monthlyIncome: number): number {
  const base = monthlyIncome > 0 ? monthlyIncome : totalExpense;
  if (base <= 0) return 0;
  const ratio = (fixedTotal / base) * 100;

  if (ratio <= 25) return Math.round(90 + ((25 - ratio) / 25) * 10);
  if (ratio <= 30) return Math.round(70 + ((30 - ratio) / 5) * 19);
  if (ratio <= 40) return Math.round(40 + ((40 - ratio) / 10) * 29);
  return Math.max(0, Math.round(39 - ((ratio - 40) / 20) * 39));
}

/** Score color based on score value */
export function scoreColor(score: number): string {
  if (score >= 90) return '#34A853';
  if (score >= 70) return '#FFB300';
  if (score >= 40) return '#FF6D00';
  return '#E53935';
}

/** Emergency fund progress ratio (0..1) */
export function fundProgressRatio(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(current / target, 1);
}

/** Meter color based on ratio */
export function meterColor(ratio: number): string {
  if (ratio > 0.8) return '#34A853';
  if (ratio > 0.5) return '#FFB300';
  return '#E53935';
}

/** Emergency fund advice text */
export function fundAdvice(ratio: number): string {
  if (ratio >= 1.0) return '目標達成！投資（NISA等）の検討を始められます。';
  if (ratio > 0.8) return 'もう少しで目標達成です。この調子で積み立てを続けましょう。';
  if (ratio > 0.5) return '着実に積み立て中です。固定費の削減でペースを上げることを検討してください。';
  return '現金残高を先に整えましょう。NISAは生活防衛資金確保後に検討をお勧めします。';
}

/** Calculate diagnosis score from profile answers */
export function diagnosisScore(
  income: number,
  rent: number,
  saving: 'yes' | 'little' | 'no',
  subCount: '0-2' | '3-5' | '6+',
  fundMonths: '<1' | '1-3' | '3-6' | '6+',
): number {
  let score = 0;

  // Rent ratio (max 30)
  const rentRatio = income > 0 ? rent / income : 0;
  if (rentRatio <= 0.2) score += 30;
  else if (rentRatio <= 0.25) score += 25;
  else if (rentRatio <= 0.3) score += 15;
  else score += 5;

  // Saving ability (max 25)
  if (saving === 'yes') score += 25;
  else if (saving === 'little') score += 15;
  else score += 5;

  // Subscription count (max 20)
  if (subCount === '0-2') score += 20;
  else if (subCount === '3-5') score += 12;
  else score += 5;

  // Emergency fund (max 25)
  if (fundMonths === '6+') score += 25;
  else if (fundMonths === '3-6') score += 20;
  else if (fundMonths === '1-3') score += 10;
  else score += 3;

  return Math.min(score, 100);
}

/** Diagnosis rank from score */
export function diagnosisRank(score: number): string {
  if (score >= 85) return 'S';
  if (score >= 70) return 'A';
  if (score >= 50) return 'B';
  if (score >= 30) return 'C';
  return 'D';
}

/** Diagnosis type label from rank */
export function diagnosisType(rank: string): string {
  switch (rank) {
    case 'S': return 'パーフェクト家計型';
    case 'A': return 'コツコツ堅実型';
    case 'B': return 'バランス改善型';
    case 'C': return 'うっかり浪費型';
    case 'D': return '家計見直しスタート型';
    default: return '';
  }
}

/** First action advice from rank */
export function diagnosisAdvice(rank: string): string {
  switch (rank) {
    case 'S': return '今の習慣を維持しつつ、投資の第一歩を踏み出しましょう';
    case 'A': return '固定費を1つだけ見直して、さらに余裕を作りましょう';
    case 'B': return 'まずはサブスクの棚卸しから始めてみましょう';
    case 'C': return '食費を週単位で管理して、ムダ遣いを見える化しましょう';
    case 'D': return '毎日の支出を記録することから始めましょう';
    default: return '';
  }
}

/** Format date to Japanese style */
export function formatDateJP(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

/** Format month to Japanese style */
export function formatMonthJP(year: number, month: number): string {
  return `${year}年${month + 1}月`;
}
