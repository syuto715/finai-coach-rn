import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, Modal, TextInput, StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../../src/constants/colors';
import { useProfile } from '../../src/hooks/useProfile';
import { useDefenseFund } from '../../src/hooks/useDefenseFund';
import { DisclaimerFooter } from '../../src/components/DisclaimerFooter';
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
  const size = 240;
  const strokeWidth = 10;
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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Gauge */}
        <View style={styles.card}>
          <View style={styles.ringContainer}>
            <Svg width={size} height={size}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={Colors.border}
                strokeWidth={strokeWidth}
                fill="none"
              />
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={strokeDashoffset}
                rotation="-90"
                origin={`${size / 2}, ${size / 2}`}
              />
            </Svg>
            <View style={styles.ringOverlay}>
              <Text style={[styles.pctText, { color }]}>{pct}%</Text>
            </View>
          </View>

          {/* Amounts */}
          <Text style={styles.currentLabel}>
            現在の現金残高：{toMan(fund.current)}
          </Text>
          <Text style={styles.targetLabel}>
            目標：生活費{profile.targetDefenseMonths}ヶ月分 = {toMan(fund.target)}
          </Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <Pressable style={styles.updateButton} onPress={() => setShowBalanceModal(true)}>
              <Text style={styles.updateButtonText}>残高を更新する</Text>
            </Pressable>
            <Pressable style={styles.targetButton} onPress={() => setShowTargetModal(true)}>
              <Text style={styles.targetButtonText}>目標月数を変更</Text>
            </Pressable>
          </View>
        </View>

        {/* Status message */}
        <View style={styles.adviceCard}>
          <Text style={styles.adviceText}>{fund.advice}</Text>
        </View>

        {/* Simulation */}
        {fund.simulation && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>達成シミュレーション</Text>
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
            <Pressable style={styles.modalSave} onPress={handleSaveBalance}>
              <Text style={styles.modalSaveText}>保存</Text>
            </Pressable>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 24,
    shadowOpacity: 1,
  },
  cardTitle: {
    fontFamily: 'Georgia',
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  ringContainer: {
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringOverlay: {
    position: 'absolute',
    alignItems: 'center',
  },
  pctText: {
    fontFamily: 'Georgia',
    fontSize: 36,
    fontWeight: '500',
  },
  currentLabel: {
    fontSize: 15,
    color: Colors.text,
    marginTop: 8,
  },
  targetLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  updateButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  updateButtonText: {
    color: Colors.textOnBrand,
    fontSize: 14,
    fontWeight: '700',
  },
  targetButton: {
    backgroundColor: Colors.buttonWarmSand,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  targetButtonText: {
    color: Colors.buttonWarmSandText,
    fontSize: 14,
    fontWeight: '700',
  },
  adviceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  adviceText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  simText: {
    fontSize: 14,
    color: Colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000060',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 16,
  },
  modalTitle: {
    fontFamily: 'Georgia',
    fontSize: 18,
    fontWeight: '500',
    color: Colors.text,
  },
  modalInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderWarm,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  modalSave: {
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalSaveText: {
    color: Colors.textOnBrand,
    fontSize: 15,
    fontWeight: '700',
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
    color: Colors.textOnBrand,
  },
});
