import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { loadProfile, saveProfile } from '../../src/services/storage';
import {
  diagnosisScore,
  diagnosisRank,
  diagnosisType,
  diagnosisAdvice,
} from '../../src/utils/calculations';

type Step = 'income' | 'rent' | 'saving' | 'subs' | 'fund' | 'result';

const incomeOptions = [
  { label: '〜20万', value: 200000 },
  { label: '20〜30万', value: 250000 },
  { label: '30〜40万', value: 350000 },
  { label: '40〜50万', value: 450000 },
  { label: '50万〜', value: 600000 },
];

const rentOptions = [
  { label: '〜5万', value: 40000 },
  { label: '5〜8万', value: 65000 },
  { label: '8〜12万', value: 100000 },
  { label: '12万〜', value: 140000 },
];

const savingOptions = [
  { label: 'はい', value: 'yes' as const },
  { label: '少しだけ', value: 'little' as const },
  { label: 'ほぼできていない', value: 'no' as const },
];

const subsOptions = [
  { label: '0〜2', value: '0-2' as const },
  { label: '3〜5', value: '3-5' as const },
  { label: '6以上', value: '6+' as const },
];

const fundOptions = [
  { label: '1ヶ月未満', value: '<1' as const },
  { label: '1〜3ヶ月', value: '1-3' as const },
  { label: '3〜6ヶ月', value: '3-6' as const },
  { label: '6ヶ月以上', value: '6+' as const },
];

export default function DiagnosisScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('income');
  const [income, setIncome] = useState(0);
  const [rent, setRent] = useState(0);
  const [saving, setSaving] = useState<'yes' | 'little' | 'no'>('little');
  const [subs, setSubs] = useState<'0-2' | '3-5' | '6+'>('0-2');
  const [fund, setFund] = useState<'<1' | '1-3' | '3-6' | '6+'>('<1');

  const score = diagnosisScore(income, rent, saving, subs, fund);
  const rank = diagnosisRank(score);
  const type = diagnosisType(rank);
  const advice = diagnosisAdvice(rank);

  const rankColor =
    rank === 'S' ? Colors.scoreGreen :
    rank === 'A' ? Colors.primaryLight :
    rank === 'B' ? Colors.warning :
    rank === 'C' ? Colors.scoreOrange :
    Colors.scoreRed;

  const handleFinish = async () => {
    const existing = await loadProfile();
    await saveProfile({
      ...(existing ?? { nickname: '', createdAt: new Date().toISOString(), cashBalance: 0, monthlyExpenseTarget: 0, targetDefenseMonths: 3 }),
      monthlyIncome: income,
      rent,
      savingAbility: saving,
      subscriptionCount: subs,
      defenseFundMonths: fund,
      diagnosisRank: rank,
      diagnosisType: type,
      onboardingCompleted: true,
    });
    router.replace('/(tabs)');
  };

  const renderQuestion = (
    title: string,
    options: { label: string; value: any }[],
    onSelect: (v: any) => void,
    nextStep: Step,
  ) => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionTitle}>{title}</Text>
      <View style={styles.options}>
        {options.map((opt) => (
          <Pressable
            key={opt.label}
            style={styles.optionButton}
            onPress={() => {
              onSelect(opt.value);
              setStep(nextStep);
            }}
          >
            <Text style={styles.optionText}>{opt.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  if (step === 'result') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.resultContent}>
        <Text style={styles.resultEmoji}>
          {rank === 'S' ? '🏆' : rank === 'A' ? '⭐' : rank === 'B' ? '👍' : rank === 'C' ? '💪' : '🌱'}
        </Text>
        <Text style={[styles.rankText, { color: rankColor }]}>{rank}</Text>
        <Text style={styles.typeText}>{type}</Text>
        <Text style={styles.scoreLabel}>スコア: {score}/100</Text>

        <View style={styles.adviceBox}>
          <Text style={styles.adviceTitle}>まずやるべきこと</Text>
          <Text style={styles.adviceText}>{advice}</Text>
        </View>

        <Pressable style={styles.startButton} onPress={handleFinish}>
          <Text style={styles.startButtonText}>始める</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        {(['income', 'rent', 'saving', 'subs', 'fund'] as Step[]).map((s, i) => (
          <View
            key={s}
            style={[
              styles.progressDot,
              { backgroundColor: ['income', 'rent', 'saving', 'subs', 'fund'].indexOf(step) >= i
                ? Colors.primary
                : Colors.border },
            ]}
          />
        ))}
      </View>

      {step === 'income' && renderQuestion('毎月の手取り収入は？', incomeOptions, setIncome, 'rent')}
      {step === 'rent' && renderQuestion('家賃・住宅ローンは月いくら？', rentOptions, setRent, 'saving')}
      {step === 'saving' && renderQuestion('毎月貯金できていますか？', savingOptions, setSaving, 'subs')}
      {step === 'subs' && renderQuestion('サブスクはいくつ入っていますか？', subsOptions, setSubs, 'fund')}
      {step === 'fund' && renderQuestion('生活防衛資金は生活費何ヶ月分ある？', fundOptions, setFund, 'result')}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 60,
    paddingBottom: 24,
  },
  progressDot: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  options: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  resultContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 60,
  },
  resultEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  rankText: {
    fontSize: 72,
    fontWeight: '900',
  },
  typeText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
  },
  scoreLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  adviceBox: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginTop: 32,
    gap: 8,
  },
  adviceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  adviceText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 32,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
