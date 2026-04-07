import React, { useState, useCallback, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { Shadows } from '../../src/constants/shadows';
import { loadProfile, saveProfile } from '../../src/services/storage';
import { Button } from '../../src/components/Button';
import {
  diagnosisScore,
  diagnosisRank,
  diagnosisType,
  diagnosisAdvice,
  diagnosisRankColor,
} from '../../src/utils/calculations';

const incomeOptions = [
  { label: '〜20万', value: 175000 },
  { label: '20〜30万', value: 250000 },
  { label: '30〜40万', value: 350000 },
  { label: '40〜50万', value: 450000 },
  { label: '50万〜', value: 600000 },
];

const rentOptions = [
  { label: '〜5万', value: 35000 },
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

const questions = [
  { title: '毎月の手取り収入は？', options: incomeOptions },
  { title: '家賃・住宅ローンは月いくら？', options: rentOptions },
  { title: '毎月貯金できていますか？', options: savingOptions },
  { title: 'サブスクはいくつ入っていますか？', options: subsOptions },
  { title: '生活防衛資金は生活費何ヶ月分ある？', options: fundOptions },
];

export default function DiagnosisScreen() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [income, setIncome] = useState(0);
  const [rent, setRent] = useState(0);
  const [saving, setSaving] = useState<'yes' | 'little' | 'no'>('little');
  const [subs, setSubs] = useState<'0-2' | '3-5' | '6+'>('0-2');
  const [fund, setFund] = useState<'<1' | '1-3' | '3-6' | '6+'>('<1');
  const [showResult, setShowResult] = useState(false);
  const rankAnim = useRef(new Animated.Value(0)).current;

  const score = diagnosisScore(income, rent, saving, subs, fund);
  const rank = diagnosisRank(score);
  const type = diagnosisType(rank);
  const advice = diagnosisAdvice(rank);
  const rankColor = diagnosisRankColor(rank);

  const handleSelect = useCallback((value: any, index: number) => {
    setSelectedIndex(index);

    switch (currentQuestion) {
      case 0: setIncome(value); break;
      case 1: setRent(value); break;
      case 2: setSaving(value); break;
      case 3: setSubs(value); break;
      case 4: setFund(value); break;
    }

    setTimeout(() => {
      setSelectedIndex(null);
      if (currentQuestion < 4) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
        Animated.spring(rankAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 8,
          bounciness: 12,
        }).start();
      }
    }, 400);
  }, [currentQuestion, rankAnim]);

  const handleFinish = async () => {
    const existing = await loadProfile();
    await saveProfile({
      nickname: existing?.nickname ?? '',
      monthlyIncome: income,
      rent,
      savingAbility: saving,
      subscriptionCount: subs,
      defenseFundMonths: fund,
      cashBalance: 0,
      monthlyExpenseTarget: Math.round(income * 0.8),
      targetDefenseMonths: 3,
      diagnosisRank: rank,
      diagnosisType: type,
      onboardingCompleted: true,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    });
    router.replace('/(tabs)');
  };

  if (showResult) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.resultContent}>
        <Animated.Text style={[
          styles.rankText,
          { color: rankColor },
          { transform: [{ scale: rankAnim }] },
        ]}>
          {rank}
        </Animated.Text>
        <Text style={styles.typeText}>{type}</Text>

        <View style={styles.adviceCard}>
          <View style={styles.adviceAccent} />
          <Text style={styles.adviceText}>{advice}</Text>
        </View>

        <Button
          title="始める"
          variant="primary"
          size="lg"
          onPress={handleFinish}
          style={styles.startButton}
        />
      </ScrollView>
    );
  }

  const q = questions[currentQuestion];

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progress}>
        {questions.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressBar,
              { backgroundColor: currentQuestion >= i ? Colors.secondary : Colors.border },
            ]}
          />
        ))}
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionTitle}>{q.title}</Text>
        <View style={styles.options}>
          {q.options.map((opt, i) => (
            <Pressable
              key={opt.label}
              style={[
                styles.optionButton,
                selectedIndex === i && styles.optionSelected,
              ]}
              onPress={() => handleSelect(opt.value, i)}
              disabled={selectedIndex !== null}
            >
              <Text style={[
                styles.optionText,
                selectedIndex === i && styles.optionTextSelected,
              ]}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
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
    gap: 6,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  questionTitle: {
    fontFamily: 'Georgia',
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 30,
  },
  options: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  optionSelected: {
    backgroundColor: Colors.secondaryLight,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  optionTextSelected: {
    color: Colors.secondary,
  },
  resultContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 60,
    gap: 16,
  },
  rankText: {
    fontFamily: 'Georgia',
    fontSize: 64,
    fontWeight: '700',
  },
  typeText: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  adviceCard: {
    backgroundColor: Colors.secondaryLight,
    borderRadius: 16,
    padding: 20,
    paddingLeft: 24,
    width: '100%',
  },
  adviceAccent: {
    position: 'absolute',
    left: 0,
    top: 16,
    bottom: 16,
    width: 4,
    borderRadius: 2,
    backgroundColor: Colors.secondary,
  },
  adviceText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },
  startButton: {
    width: '100%',
    marginTop: 16,
  },
});
