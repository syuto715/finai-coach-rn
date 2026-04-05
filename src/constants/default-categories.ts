import type { ExpenseCategory } from '../models/category';

export const DEFAULT_CATEGORIES: ExpenseCategory[] = [
  { id: 'fixed', name: '固定費', emoji: '🏠', isFixed: true, isDefault: true, order: 0 },
  { id: 'food', name: '食費', emoji: '🍚', isFixed: false, isDefault: true, order: 1 },
  { id: 'eating-out', name: '外食費', emoji: '🍽️', isFixed: false, isDefault: true, order: 2 },
  { id: 'daily', name: '日用品', emoji: '🧴', isFixed: false, isDefault: true, order: 3 },
  { id: 'transport', name: '交通費', emoji: '🚗', isFixed: false, isDefault: true, order: 4 },
  { id: 'utility', name: '光熱費', emoji: '⚡', isFixed: true, isDefault: true, order: 5 },
  { id: 'clothing', name: '衣服', emoji: '👕', isFixed: false, isDefault: true, order: 6 },
  { id: 'social', name: '交際費', emoji: '🤝', isFixed: false, isDefault: true, order: 7 },
  { id: 'hobby', name: '趣味', emoji: '🎮', isFixed: false, isDefault: true, order: 8 },
  { id: 'entertainment', name: '娯楽', emoji: '🎬', isFixed: false, isDefault: true, order: 9 },
  { id: 'other', name: 'その他', emoji: '📦', isFixed: false, isDefault: true, order: 10 },
  { id: 'hair', name: '髪の毛', emoji: '💇', isFixed: false, isDefault: true, order: 11 },
];
