import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../src/constants/colors';
import { Shadows } from '../src/constants/shadows';
import { Button } from '../src/components/Button';
import { getPresetForProposal } from '../src/constants/savings-presets';
import { formatNumber } from '../src/utils/calculations';

export default function SavingsSimulatorScreen() {
  const { title } = useLocalSearchParams<{ title: string }>();
  const router = useRouter();

  const preset = getPresetForProposal(title ?? '');
  const monthly = preset.monthlySaving;
  const yearly = monthly * 12;

  const timeline = [
    { label: '1ヶ月後', amount: monthly * 1 },
    { label: '6ヶ月後', amount: monthly * 6 },
    { label: '1年後', amount: monthly * 12 },
    { label: '3年後', amount: monthly * 36 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={styles.heading}>この行動の効果</Text>
      <Text style={styles.presetTitle}>{preset.title}</Text>
      <Text style={styles.presetDesc}>{preset.description}</Text>

      {/* Main number */}
      <View style={styles.mainCard}>
        <Text style={styles.mainLabel}>年間</Text>
        <Text style={styles.mainAmount}>¥{formatNumber(yearly)}</Text>
        <Text style={styles.subAmount}>月 ¥{formatNumber(monthly)} の節約</Text>
      </View>

      {/* Timeline */}
      <View style={styles.timelineCard}>
        {timeline.map((item, i) => (
          <View key={i} style={styles.timelineRow}>
            <View style={styles.timelineDotCol}>
              <View style={[
                styles.timelineDot,
                i === timeline.length - 1 && styles.timelineDotLarge,
              ]} />
              {i < timeline.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>{item.label}</Text>
              <Text style={[
                styles.timelineAmount,
                i === timeline.length - 1 && styles.timelineAmountLarge,
              ]}>
                ¥{formatNumber(item.amount)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* CTA */}
      <Button
        title="今すぐ実行する"
        variant="primary"
        size="lg"
        onPress={() => router.back()}
        style={styles.ctaButton}
      />
    </ScrollView>
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
    paddingBottom: 40,
  },
  heading: {
    fontFamily: 'Georgia',
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 28,
  },
  presetTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  presetDesc: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  mainCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    ...Shadows.md,
  },
  mainLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  mainAmount: {
    fontFamily: 'Georgia',
    fontSize: 48,
    fontWeight: '700',
    color: Colors.secondary,
    lineHeight: 52,
    letterSpacing: -1,
    marginTop: 4,
  },
  subAmount: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  timelineCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    ...Shadows.sm,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 16,
  },
  timelineDotCol: {
    alignItems: 'center',
    width: 16,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.secondary,
    marginTop: 4,
  },
  timelineDotLarge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
  },
  timelineLabel: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
  timelineAmount: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 2,
  },
  timelineAmountLarge: {
    fontSize: 28,
    color: Colors.secondary,
    fontWeight: '700',
  },
  ctaButton: {
    marginTop: 8,
  },
});
