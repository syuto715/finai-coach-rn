export type SubCategory = 'video' | 'music' | 'news' | 'tool' | 'game' | 'other';

export interface Subscription {
  id: string;
  name: string;
  monthlyPrice: number;
  category: SubCategory;
  startDate: string;
  lastUsedDate?: string;
  memo: string;
  isActive: boolean;
}
