import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, Modal, TextInput, StyleSheet,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../../src/constants/colors';
import { Strings } from '../../src/constants/strings';
import { useProfile } from '../../src/hooks/useProfile';
import { useDefenseFund } from '../../src/hooks/useDefenseFund';
import { DisclaimerFooter } from '../../src/components/DisclaimerFooter';
import { formatNumber, toMan } from '../../src/utils/calculations';

export default function MeterScreen() {
  const { profile, updateProfile } = useProfile();
  const fund = useDefenseFund(profile);
  const [showModal, setShowModal] = useState(false);
  const [inputAmount, setInputAmount] = useState('');

  const pct = Math.round(fund.ratio * 100);
  const color = fund.color;

  // Ring
  const size = 240;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - fund.ratio * circumference;

  const handleSave = async () => {
    const val = parseInt(inputAmount, 10);
    if (isNaN(val) || val < 0) return;
    await updateProfile({ cashBalance: val });
    setShowModal(false);
    setInputAmount('');
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
                stroke={color + '26'}
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
              <Text style={styles.pctLabel}>達成</Text>
            </View>
          </View>

          {/* Zone labels */}
          <View style={styles.zones}>
            <Zone label="0-50%" color={Colors.error} active={fund.ratio <= 0.5} />
            <Zone label="51-80%" color={Colors.warning} active={fund.ratio > 0.5 && fund.ratio <= 0.8} />
            <Zone label="81-100%" color={Colors.success} active={fund.ratio > 0.8} />
          </View>

          {/* Amounts */}
          <Text style={styles.amountMain}>
            ¥{formatNumber(fund.current)}
            <Text style={styles.amountSub}> / ¥{formatNumber(fund.target)}</Text>
          </Text>
          <Text style={styles.amountMan}>
            （{fund.currentLabel} / {fund.targetLabel}）
          </Text>

          <Pressable style={styles.updateButton} onPress={() => setShowModal(true)}>
            <Text style={styles.updateButtonText}>{Strings.updateFund}</Text>
          </Pressable>
        </View>

        {/* Advice */}
        <View style={styles.adviceCard}>
          <Text style={styles.adviceIcon}>💡</Text>
          <Text style={styles.adviceText}>{fund.advice}</Text>
        </View>

        {/* Simulation */}
        {fund.simulation && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>達成シミュレーション</Text>
            <Text style={styles.simText}>
              月{formatNumber(fund.simulation.monthlySaving)}円の積立で{fund.simulation.months}ヶ月後に達成
            </Text>
          </View>
        )}
      </ScrollView>
      <DisclaimerFooter />

      {/* Update Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{Strings.updateFund}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="現在の現金残高（円）"
              keyboardType="number-pad"
              value={inputAmount}
              onChangeText={setInputAmount}
            />
            <Pressable style={styles.modalSave} onPress={handleSave}>
              <Text style={styles.modalSaveText}>{Strings.save}</Text>
            </Pressable>
            <Pressable onPress={() => setShowModal(false)}>
              <Text style={styles.modalCancel}>{Strings.cancel}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Zone({ label, color, active }: { label: string; color: string; active: boolean }) {
  return (
    <View style={[styles.zone, active && { backgroundColor: color + '26', borderColor: color }]}>
      <Text style={[styles.zoneText, active && { color, fontWeight: '700' }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
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
    fontSize: 42,
    fontWeight: '900',
  },
  pctLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  zones: {
    flexDirection: 'row',
    gap: 6,
  },
  zone: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  zoneText: {
    fontSize: 11,
    color: Colors.textHint,
  },
  amountMain: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  amountSub: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  amountMan: {
    fontSize: 11,
    color: Colors.textHint,
  },
  updateButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  adviceCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    elevation: 1,
  },
  adviceIcon: {
    fontSize: 18,
  },
  adviceText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
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
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  modalInput: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  modalSave: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalCancel: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 8,
  },
});
