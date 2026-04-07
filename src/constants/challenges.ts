export interface ChallengePreset {
  title: string;
  description: string;
  targetValue: number;
  unit: string;
  category: 'spending' | 'saving' | 'habit';
}

export const WEEKLY_CHALLENGES: ChallengePreset[] = [
  {
    title: '今週のコンビニは3回まで',
    description: 'コンビニでのちょこっと買いを減らそう',
    targetValue: 3,
    unit: '回',
    category: 'habit',
  },
  {
    title: '今週の外食は2回まで',
    description: '自炊を増やして食費をコントロール',
    targetValue: 2,
    unit: '回',
    category: 'spending',
  },
  {
    title: '今週は¥0の日を3日作る',
    description: 'お金を使わない日を意識的に作ろう',
    targetValue: 3,
    unit: '日',
    category: 'saving',
  },
  {
    title: '今週の間食・ドリンク代を¥1,000以内に',
    description: 'カフェやコンビニスイーツを我慢',
    targetValue: 1000,
    unit: '円',
    category: 'spending',
  },
];
