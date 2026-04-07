export interface SavingsPreset {
  key: string;
  title: string;
  monthlySaving: number;
  description: string;
}

export const SAVINGS_PRESETS: Record<string, SavingsPreset> = {
  'mobile-switch': {
    key: 'mobile-switch',
    title: '携帯を格安SIMに変更',
    monthlySaving: 4000,
    description: '大手キャリア→格安SIMで月約4,000円の節約',
  },
  'insurance-review': {
    key: 'insurance-review',
    title: '保険の見直し',
    monthlySaving: 3000,
    description: '不要な特約を外すだけで月約3,000円',
  },
  'subscription-cancel': {
    key: 'subscription-cancel',
    title: 'サブスク1つ解約',
    monthlySaving: 1000,
    description: '使っていないサブスクを1つ解約',
  },
  'electricity-switch': {
    key: 'electricity-switch',
    title: '電力会社の切り替え',
    monthlySaving: 2000,
    description: '新電力への切り替えで月約2,000円',
  },
  'food-weekly-budget': {
    key: 'food-weekly-budget',
    title: '食費を週単位管理',
    monthlySaving: 5000,
    description: '週予算を意識するだけで月約5,000円の節約',
  },
};

/** Map rule engine proposal keywords to savings presets */
export function getPresetForProposal(title: string): SavingsPreset {
  if (title.includes('固定費')) return SAVINGS_PRESETS['mobile-switch'];
  if (title.includes('サブスク')) return SAVINGS_PRESETS['subscription-cancel'];
  if (title.includes('食費')) return SAVINGS_PRESETS['food-weekly-budget'];
  if (title.includes('楽しみ') || title.includes('娯楽')) return SAVINGS_PRESETS['subscription-cancel'];
  if (title.includes('防衛資金') || title.includes('生活防衛')) return SAVINGS_PRESETS['insurance-review'];
  return SAVINGS_PRESETS['food-weekly-budget'];
}
