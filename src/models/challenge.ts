export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  category: 'spending' | 'saving' | 'habit';
}
