import { useState, useEffect, useCallback } from 'react';
import type { ActionProposal } from '../models/action-proposal';
import type { Expense } from '../models/expense';
import type { Subscription } from '../models/subscription';
import type { UserProfile } from '../models/user-profile';
import { loadProposals, saveProposals } from '../services/storage';
import { generateProposal } from '../services/rule-engine';

export function useProposal(
  expenses: Expense[],
  subscriptions: Subscription[],
  profile: UserProfile | null,
) {
  const [proposals, setProposals] = useState<ActionProposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProposals().then((data) => {
      setProposals(data);
      setLoading(false);
    });
  }, []);

  const now = new Date();
  const currentMonthProposals = proposals.filter((p) => {
    const d = new Date(p.createdAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });

  const currentProposal = currentMonthProposals.length > 0
    ? currentMonthProposals[currentMonthProposals.length - 1]
    : null;

  const monthlyCount = currentMonthProposals.length;
  const canGenerate = monthlyCount < 3;

  const generate = useCallback(async () => {
    if (!profile || !canGenerate) return null;
    const proposal = generateProposal({ expenses, subscriptions, profile });
    const next = [...proposals, proposal];
    setProposals(next);
    await saveProposals(next);
    return proposal;
  }, [expenses, subscriptions, profile, proposals, canGenerate]);

  const markExecuted = useCallback(
    async (id: string) => {
      const next = proposals.map((p) =>
        p.id === id ? { ...p, isExecuted: true, executedAt: new Date().toISOString() } : p,
      );
      setProposals(next);
      await saveProposals(next);
    },
    [proposals],
  );

  return {
    proposals,
    currentProposal,
    loading,
    generate,
    markExecuted,
    canGenerate,
    monthlyCount,
  };
}
