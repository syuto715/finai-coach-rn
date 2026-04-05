export type CategoryType = 'fixed' | 'food' | 'transport' | 'utility' | 'entertainment' | 'subscription' | 'other';

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: CategoryType;
  label: string;
  isFixed: boolean;
}
