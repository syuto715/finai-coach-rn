import { useMemo } from 'react';
import type { ExecutionRecord } from '../models/execution-record';

export function useStreak(executions: ExecutionRecord[]) {
  const streak = useMemo(() => {
    if (executions.length === 0) return 0;

    // Get unique months that have executions (sorted desc)
    const months = new Set<string>();
    for (const e of executions) {
      const d = new Date(e.executedAt);
      months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }

    const sortedMonths = [...months].sort().reverse();
    if (sortedMonths.length === 0) return 0;

    // Check if current or previous month is in the list
    const now = new Date();
    const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

    if (sortedMonths[0] !== currentKey && sortedMonths[0] !== prevKey) {
      return 0;
    }

    // Count consecutive months backwards
    let count = 0;
    let checkDate = sortedMonths[0] === currentKey ? now : prevDate;

    for (let i = 0; i < 120; i++) {
      const key = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}`;
      if (months.has(key)) {
        count++;
        checkDate = new Date(checkDate.getFullYear(), checkDate.getMonth() - 1, 1);
      } else {
        break;
      }
    }

    return count;
  }, [executions]);

  const streakColor = streak === 0 ? '#9E9E9E' : streak < 3 ? '#FF8F00' : '#E53935';
  const streakLabel = streak >= 3 ? `${streak}ヶ月連続達成！` : `${streak}ヶ月`;

  return { streak, streakColor, streakLabel };
}
