import { useState, useEffect, useCallback } from 'react';
import { generateId } from '../utils/generateId';
import type { Subscription } from '../models/subscription';
import { loadSubscriptions, saveSubscriptions } from '../services/storage';

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const data = await loadSubscriptions();
    setSubscriptions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addSubscription = useCallback(
    async (input: Omit<Subscription, 'id' | 'isActive'>) => {
      const sub: Subscription = { ...input, id: generateId(), isActive: true };
      const next = [...subscriptions, sub];
      setSubscriptions(next);
      await saveSubscriptions(next);
      return sub;
    },
    [subscriptions],
  );

  const deleteSubscription = useCallback(
    async (id: string) => {
      const next = subscriptions.filter((s) => s.id !== id);
      setSubscriptions(next);
      await saveSubscriptions(next);
    },
    [subscriptions],
  );

  const updateLastUsed = useCallback(
    async (id: string) => {
      const next = subscriptions.map((s) =>
        s.id === id ? { ...s, lastUsedDate: new Date().toISOString() } : s,
      );
      setSubscriptions(next);
      await saveSubscriptions(next);
    },
    [subscriptions],
  );

  const activeSubs = subscriptions.filter((s) => s.isActive);
  const totalMonthly = activeSubs.reduce((s, sub) => s + sub.monthlyPrice, 0);

  const unusedSubs = activeSubs.filter((s) => {
    if (!s.lastUsedDate) return true;
    const last = new Date(s.lastUsedDate);
    const diffDays = (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 30;
  });

  return {
    subscriptions,
    activeSubs,
    loading,
    addSubscription,
    deleteSubscription,
    updateLastUsed,
    reload,
    totalMonthly,
    unusedSubs,
  };
}
