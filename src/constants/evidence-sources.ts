export const evidenceSources = {
  soumu_kakei_2026_01: {
    name: '総務省 家計調査 2026年1月分',
    publishedAt: '2026年3月10日公表',
    url: 'https://www.stat.go.jp/data/kakei/',
    description: '2人以上世帯の月平均消費支出データ',
    averages: {
      totalMonthlyExpense: 287000,
      fixedCostRatio: 0.28,
      food: 78000,
      housing: 17000,
      utility: 21000,
      transport: 38000,
      communication: 14000,
      education: 11000,
      entertainment: 25000,
    },
  },
} as const;
