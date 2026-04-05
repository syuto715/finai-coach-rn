export const Strings = {
  appName: 'FinAI Coach',
  appTagline: '家計を行動で変える',

  // tabs
  tabHome: 'ホーム',
  tabAnalysis: '分析',
  tabSubscriptions: 'サブスク',
  tabMeter: 'メーター',
  tabHistory: '履歴',

  // home
  thisMonthAction: '今月のアクション',
  actionDone: 'やった！',
  actionSkip: 'スキップ',
  loadingProposal: '分析中…',
  noProposal: '今月のアクションはまだありません',
  generateProposal: 'アクションを生成する',
  estimatedSaving: '削減見込み',
  addExpense: '＋ 支出を記録',

  // history
  executionHistory: '実行履歴',
  noHistory: 'まだ実行記録がありません。\nホームの「やった！」を押すと記録されます。',

  // meter
  emergencyFund: '生活防衛資金メーター',
  updateFund: '残高を更新する',

  // analysis
  monthlyAnalysis: '月次支出分析',
  totalExpense: '今月の合計支出',
  byCategory: 'カテゴリ別',

  // subscriptions
  subscriptionTitle: 'サブスク棚卸し',
  addSubscription: '＋ サブスクを追加',
  noSubscriptions: 'サブスクがまだ登録されていません',

  // diagnosis
  diagnosisTitle: 'かんたん家計診断',
  diagnosisStart: '診断を始める',

  // actions
  confirmDone: 'このアクションを完了にしますか？',
  cancel: 'キャンセル',
  save: '保存',

  // trust
  trustHigh: '信頼度：高',
  trustMedium: '信頼度：中',
  trustLow: '信頼度：低',

  // disclaimer
  disclaimerFooter: '本アプリの情報は一般論・教育目的であり、投資助言ではありません。',
  consultExpert: '重要な金融判断は、FP（ファイナンシャルプランナー）等の専門家にご相談ください。',

  // categories
  categories: {
    fixed: '固定費',
    food: '食費',
    transport: '交通費',
    utility: '光熱費',
    entertainment: '娯楽',
    subscription: 'サブスク',
    other: 'その他',
  } as Record<string, string>,

  subCategories: {
    video: '動画',
    music: '音楽',
    news: 'ニュース',
    tool: 'ツール',
    game: 'ゲーム',
    other: 'その他',
  } as Record<string, string>,
} as const;
