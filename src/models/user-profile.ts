export interface UserProfile {
  nickname: string;
  monthlyIncome: number;
  rent: number;
  savingAbility: 'yes' | 'little' | 'no';
  subscriptionCount: '0-2' | '3-5' | '6+';
  defenseFundMonths: '<1' | '1-3' | '3-6' | '6+';
  cashBalance: number;
  monthlyExpenseTarget: number;
  targetDefenseMonths: number;
  diagnosisRank: string;
  diagnosisType: string;
  onboardingCompleted: boolean;
  createdAt: string;
}

export const defaultProfile: UserProfile = {
  nickname: '',
  monthlyIncome: 0,
  rent: 0,
  savingAbility: 'little',
  subscriptionCount: '0-2',
  defenseFundMonths: '<1',
  cashBalance: 0,
  monthlyExpenseTarget: 0,
  targetDefenseMonths: 3,
  diagnosisRank: '',
  diagnosisType: '',
  onboardingCompleted: false,
  createdAt: new Date().toISOString(),
};
