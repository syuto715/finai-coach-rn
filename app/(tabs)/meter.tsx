import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, Modal, TextInput, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../../src/constants/colors';
import { Shadows } from '../../src/constants/shadows';
import { useProfile } from '../../src/hooks/useProfile';
import { useDefenseFund } from '../../src/hooks/useDefenseFund';
import { DisclaimerFooter } from '../../src/components/DisclaimerFooter';
import { Button } from '../../src/components/Button';
import { formatNumber, toMan } from '../../src/utils/calculations';

const targetMonthOptions = [3, 4, 5, 6];

export default function MeterScreen() {
  const { profile, updateProfile, reload: reloadProfile } = useProfile();
  const fund = useDefenseFund(profile);

  useFocusEffect(
    useCallback(() => {
      reloadProfile();
    }, [reloadProfile]),
  );
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [inputAmount, setInputAmount] = useState('');

  const pct = Math.round(fund.ratio * 100);
  const color = fund.color;

  // Ring
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - fund.ratio * circumference;

  const handleSaveBalance = async () => {
    const val = parseInt(inputAmount, 10);
    if (isNaN(val) || val < 0) return;
    await updateProfile({ cashBalance: val });
    setShowBalanceModal(false);
    setInputAmount('');
  };

  const handleChangeTarget = async (months: number) => {
    await updateProfile({ targetDefenseMonths: months });
    setShowTargetModal(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Page Title */}
        <Text style={styles.pageTitle}>生活防衛資金</Text>

        {/* Circular Progress */}
        <View style={styles.ringSection}>
          <Svg width={size} height={size}>
            <Circle
              cx={size / 2} cy={size / 2} r={radius}
              stroke={Colors.border} strokeWidth={strokeWidth} fill="none" />
            <Circle
              cx={size / 2} cy={size / 2} r={radius}
              stroke={color} strokeWidth={strokeWidth} fill="none"
              strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={strokeDashoffset}
              rotation="-90" origin={`${size / 2}, ${size / 2}`} />
          </Svg>
          <View style={styles.ringOverlay}>
            <Text style={[styles.pctText, { color }]}>{pct}%</Text>
            <Text style={styles.pctLabel}>達成率</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>現在の残高</Text>
            <Text style={styles.statAmount}>{toMan(fund.current)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>目標金額</Text>
            <Text style={styles.statAmount}>{toMan(fund.target)}</Text>
          </View>
        </View>

        {/* Advice Card */}
        <View style={styles.adviceCard}>
          <View style={styles.adviceAccent} />
          <Text style={styles.adviceText}>{fund.advice}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <Button
            title="残高を更新"
            variant="primary"
            size="lg"
            onPress={() => setShowBalanceModal(true)}
            style={styles.flex1}
          />
          <Button
            title="目標を変更"
            variant="secondary"
            size="lg"
            onPress={() => setShowTargetModal(true)}
            style={styles.flex1}
          />
        </View>

        {/* Simulation */}
        {fund.simulation && (
          <View style={styles.simCard}>
            <Text style={styles.simTitle}>達成シミュレーション</Text>
            <Text style={styles.simText}>
              月{formatNumber(fund.simulation.monthlySaving)}円積立で{fund.simulation.months}ヶ月後達成
            </Text>
          </View>
        )}
      </ScrollView>
      <DisclaimerFooter />

      {/* Balance Update Modal */}
      <Modal visible={showBalanceModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>残高を更新する</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="現在の現金残高（円）"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="number-pad"
              value={inputAmount}
              onChangeText={setInputAmount}
            />
            <Button title="保存" variant="primary" size="lg" onPress={handleSaveBalance} />
            <Pressable onPress={() => setShowBalanceModal(false)}>
              <Text style={styles.modalCancel}>キャンセル</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Target Month Modal */}
      <Modal visible={showTargetModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>目標月数を変更</Text>
            <View style={styles.monthOptions}>
              {targetMonthOptions.map((m) => (
                <Pressable
                  key={m}
                  style={[
                    styles.monthOption,
                    profile.targetDefenseMonths === m && styles.monthOptionActive,
                  ]}
                  onPress={() => handleChangeTarget(m)}
                >
                  <Text style={[
                    styles.monthOptionText,
                    profile.targetDefenseMonths === m && styles.monthOptionTextActive,
                  ]}>
                    {m}ヶ月
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable onPress={() => setShowTargetModal(false)}>
              <Text style={styles.modalCancel}>キャンセル</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    gap: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  pageTitle: {
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 34,
    letterSpacing: -0.3,
    alignSelf: 'flex-start',
  },
  ringSection: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringOverlay: {
    position: 'absolute',
    alignItems: 'center',
  },
  pctText: {
    fontFamily: 'Georgia',
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 52,
  },
  pctLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    alignSelf: 'stretch',
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statAmount: {
    fontFamily: 'Georgia',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 4,
  },
  adviceCard: {
    backgroundColor: Colors.secondaryLight,
    borderRadius: 16,
    padding: 16,
    paddingLeft: 24,
    alignSelf: 'stretch',
  },
  adviceAccent: {
    position: 'absolute',
    left: 0,
    top: 12,
    bottom: 12,
    width: 4,
    borderRadius: 2,
    backgroundColor: Colors.secondary,
  },
  adviceText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    alignSelf: 'stretch',
  },
  flex1: {
    flex: 1,
  },
  simCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 4,
    ...Shadows.sm,
  },
  simTitle: {
    fontFamily: 'Georgia',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  simText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000060',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surfaceElevated,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 16,
  },
  modalTitle: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  modalInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  modalCancel: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 8,
  },
  monthOptions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  monthOption: {
    backgroundColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  monthOptionActive: {
    backgroundColor: Colors.secondary,
  },
  monthOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  monthOptionTextActive: {
    color: '#ffffff',
  },
});
