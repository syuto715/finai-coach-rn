import { useState, useEffect, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import type { ExpenseCategory } from '../models/category';
import { DEFAULT_CATEGORIES } from '../constants/default-categories';
import { loadCategories, saveCategories } from '../services/storage';

export function useCategories() {
  const [categories, setCategories] = useState<ExpenseCategory[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories().then((data) => {
      if (data.length === 0) {
        // First launch: save defaults
        saveCategories(DEFAULT_CATEGORIES);
        setCategories(DEFAULT_CATEGORIES);
      } else {
        setCategories(data.sort((a, b) => a.order - b.order));
      }
      setLoading(false);
    });
  }, []);

  const sorted = [...categories].sort((a, b) => a.order - b.order);

  const addCategory = useCallback(
    async (name: string, emoji: string, isFixed: boolean) => {
      const maxOrder = categories.reduce((max, c) => Math.max(max, c.order), 0);
      const cat: ExpenseCategory = {
        id: uuid(),
        name,
        emoji,
        isFixed,
        isDefault: false,
        order: maxOrder + 1,
      };
      const next = [...categories, cat];
      setCategories(next);
      await saveCategories(next);
      return cat;
    },
    [categories],
  );

  const updateCategory = useCallback(
    async (id: string, updates: Partial<Pick<ExpenseCategory, 'name' | 'emoji' | 'isFixed'>>) => {
      const next = categories.map((c) =>
        c.id === id ? { ...c, ...updates } : c,
      );
      setCategories(next);
      await saveCategories(next);
    },
    [categories],
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      const target = categories.find((c) => c.id === id);
      if (!target || target.isDefault) return;
      const next = categories.filter((c) => c.id !== id);
      setCategories(next);
      await saveCategories(next);
    },
    [categories],
  );

  const reorderCategories = useCallback(
    async (newOrder: string[]) => {
      const next = newOrder.map((id, index) => {
        const cat = categories.find((c) => c.id === id);
        return cat ? { ...cat, order: index } : null;
      }).filter(Boolean) as ExpenseCategory[];
      setCategories(next);
      await saveCategories(next);
    },
    [categories],
  );

  const moveCategory = useCallback(
    async (id: string, direction: 'up' | 'down') => {
      const sortedCats = [...categories].sort((a, b) => a.order - b.order);
      const idx = sortedCats.findIndex((c) => c.id === id);
      if (idx < 0) return;
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= sortedCats.length) return;

      const tempOrder = sortedCats[idx].order;
      sortedCats[idx] = { ...sortedCats[idx], order: sortedCats[swapIdx].order };
      sortedCats[swapIdx] = { ...sortedCats[swapIdx], order: tempOrder };

      setCategories(sortedCats);
      await saveCategories(sortedCats);
    },
    [categories],
  );

  const resetToDefault = useCallback(async () => {
    setCategories(DEFAULT_CATEGORIES);
    await saveCategories(DEFAULT_CATEGORIES);
  }, []);

  // Lookup helpers
  const getCategoryName = useCallback(
    (id: string) => categories.find((c) => c.id === id)?.name ?? id,
    [categories],
  );

  const getCategoryEmoji = useCallback(
    (id: string) => categories.find((c) => c.id === id)?.emoji ?? '📦',
    [categories],
  );

  const isCategoryFixed = useCallback(
    (id: string) => categories.find((c) => c.id === id)?.isFixed ?? false,
    [categories],
  );

  return {
    categories: sorted,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    moveCategory,
    resetToDefault,
    getCategoryName,
    getCategoryEmoji,
    isCategoryFixed,
  };
}
