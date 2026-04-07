import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Switch, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '../src/constants/colors';
import { Shadows } from '../src/constants/shadows';
import { Strings } from '../src/constants/strings';
import { useExpenses } from '../src/hooks/useExpenses';
import { useCategories } from '../src/hooks/useCategories';
import { Button } from '../src/components/Button';

export default function AddExpenseScreen() {
  const router = useRouter();
  const { addExpense } = useExpenses();
  const { categories, isCategoryFixed } = useCategories();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [label, setLabel] = useState('');
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    if (isCategoryFixed(category)) {
      setIsFixed(true);
    }
  }, [category, isCategoryFixed]);

  const handleSave = async () => {
    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount <= 0) return;

    await addExpense({
      date: new Date().toISOString(),
      amount: numAmount,
      category,
      label: label.trim(),
      isFixed,
    });

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.back();
  };

  const displayAmount = amount ? `¥${parseInt(amount, 10).toLocaleString('ja-JP')}` : '';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Amount Display */}
        <View style={styles.amountSection}>
          <Text style={styles.yenPrefix}>¥</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0"
            placeholderTextColor={Colors.textQuaternary}
            keyboardType="number-pad"
            value={amount}
            onChangeText={setAmount}
            autoFocus
          />
        </View>

        {/* Category Grid */}
        <Text style={styles.sectionLabel}>カテゴリ</Text>
        <View style={styles.categoryGrid}>
          {categories.map((c) => (
            <Pressable
              key={c.id}
              style={[styles.categoryButton, category === c.id && styles.categoryActive]}
              onPress={() => setCategory(c.id)}
            >
              <Text style={styles.categoryEmoji}>{c.emoji}</Text>
              <Text
                style={[styles.categoryLabel, category === c.id && styles.categoryLabelActive]}
              >
                {c.name}
              </Text>
            </Pressable>
          ))}
          <Pressable
            style={styles.editCategoryButton}
            onPress={() => router.push('/manage-categories')}
          >
            <Text style={styles.editEmoji}>✏️</Text>
            <Text style={styles.editLabel}>追加/編集</Text>
          </Pressable>
        </View>

        {/* Label */}
        <Text style={styles.sectionLabel}>メモ（任意）</Text>
        <TextInput
          style={styles.memoInput}
          placeholder="例：スーパー、電気代"
          placeholderTextColor={Colors.textTertiary}
          value={label}
          onChangeText={setLabel}
        />

        {/* Fixed toggle */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>固定費として記録</Text>
          <Switch
            value={isFixed}
            onValueChange={setIsFixed}
            trackColor={{ true: Colors.primary, false: Colors.borderStrong }}
          />
        </View>
      </ScrollView>

      {/* Save Button - Fixed at bottom */}
      <View style={styles.bottomBar}>
        <Button
          title={Strings.save}
          variant="primary"
          size="lg"
          onPress={handleSave}
          disabled={!amount || parseInt(amount) <= 0}
          style={styles.saveButton}
        />
      </View>
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
    gap: 20,
    paddingBottom: 100,
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 20,
  },
  yenPrefix: {
    fontSize: 28,
    fontWeight: '300',
    color: Colors.textTertiary,
  },
  amountInput: {
    fontFamily: 'Georgia',
    fontSize: 48,
    fontWeight: '700',
    color: Colors.text,
    minWidth: 120,
    textAlign: 'center',
    lineHeight: 52,
    letterSpacing: -1,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    width: '30%',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
    ...Shadows.sm,
  },
  categoryActive: {
    backgroundColor: Colors.secondaryLight,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  categoryLabelActive: {
    color: Colors.secondary,
    fontWeight: '600',
  },
  editCategoryButton: {
    width: '30%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderStyle: 'dashed',
  },
  editEmoji: {
    fontSize: 24,
  },
  editLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  memoInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderStrong,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 15,
    color: Colors.text,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 36,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveButton: {
    width: '100%',
  },
});
