import { useState, useEffect, useCallback } from 'react';
import { generateId } from '../utils/generateId';
import type { SavingsAchievement } from '../models/savings-achievement';
import { loadSavings, saveSavings } from '../services/storage';

export function useSavingsTracker() {
  const [savings, setSavings] = useState<SavingsAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const data = await loadSavings();
    setSavings(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addSavingsAchievement = useCallback(
    async (proposalId: string, title: string, estimatedMonthlySaving: number) => {
      const achievement: SavingsAchievement = {
        id: generateId(),
        proposalId,
        title,
        estimatedMonthlySaving,
        executedAt: new Date().toISOString(),
      };
      const next = [...savings, achievement];
      setSavings(next);
      await saveSavings(next);
      return achievement;
    },
    [savings],
  );

  // Calculate total estimated savings to date
  const totalEstimatedSavings = savings.reduce((total, s) => {
    const executedDate = new Date(s.executedAt);
    const now = new Date();
    const monthsDiff = (now.getFullYear() - executedDate.getFullYear()) * 12
      + (now.getMonth() - executedDate.getMonth());
    const months = Math.max(1, monthsDiff);
    return total + s.estimatedMonthlySaving * months;
  }, 0);

  return {
    savings,
    loading,
    addSavingsAchievement,
    totalEstimatedSavings,
    reload,
  };
}
