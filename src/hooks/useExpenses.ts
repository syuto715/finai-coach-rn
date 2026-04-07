import { useState, useEffect, useCallback } from 'react';
import { generateId } from '../utils/generateId';
import type { Expense } from '../models/expense';
import { loadExpenses, saveExpenses } from '../services/storage';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const data = await loadExpenses();
    setExpenses(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addExpense = useCallback(
    async (input: Omit<Expense, 'id'>) => {
      const expense: Expense = { ...input, id: generateId() };
      const next = [...expenses, expense];
      setExpenses(next);
      await saveExpenses(next);
      return expense;
    },
    [expenses],
  );

  const deleteExpense = useCallback(
    async (id: string) => {
      const next = expenses.filter((e) => e.id !== id);
      setExpenses(next);
      await saveExpenses(next);
    },
    [expenses],
  );

  const currentMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });

  const categoryTotals: Record<string, number> = {};
  for (const e of currentMonthExpenses) {
    categoryTotals[e.category] = (categoryTotals[e.category] ?? 0) + e.amount;
  }

  const totalThisMonth = currentMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const fixedThisMonth = currentMonthExpenses.filter((e) => e.isFixed).reduce((s, e) => s + e.amount, 0);

  return {
    expenses,
    loading,
    addExpense,
    deleteExpense,
    reload,
    currentMonthExpenses,
    categoryTotals,
    totalThisMonth,
    fixedThisMonth,
  };
}
