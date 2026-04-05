import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Switch, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../src/constants/colors';
import { Strings } from '../src/constants/strings';
import { useExpenses } from '../src/hooks/useExpenses';
import type { CategoryType } from '../src/models/expense';

const categories: { key: CategoryType; label: string; emoji: string }[] = [
  { key: 'fixed', label: '固定費', emoji: '🏠' },
  { key: 'food', label: '食費', emoji: '🍽️' },
  { key: 'transport', label: '交通費', emoji: '🚃' },
  { key: 'utility', label: '光熱費', emoji: '⚡' },
  { key: 'entertainment', label: '娯楽', emoji: '🎬' },
  { key: 'other', label: 'その他', emoji: '📦' },
];

export default function AddExpenseScreen() {
  const router = useRouter();
  const { addExpense } = useExpenses();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryType>('food');
  const [label, setLabel] = useState('');
  const [isFixed, setIsFixed] = useState(false);

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

    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Amount */}
      <View style={styles.amountSection}>
        <Text style={styles.yen}>¥</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="0"
          keyboardType="number-pad"
          value={amount}
          onChangeText={setAmount}
          autoFocus
        />
      </View>

      {/* Category */}
      <Text style={styles.sectionLabel}>カテゴリ</Text>
      <View style={styles.categoryGrid}>
        {categories.map((c) => (
          <Pressable
            key={c.key}
            style={[styles.categoryButton, category === c.key && styles.categoryActive]}
            onPress={() => setCategory(c.key)}
          >
            <Text style={styles.categoryEmoji}>{c.emoji}</Text>
            <Text
              style={[styles.categoryLabel, category === c.key && styles.categoryLabelActive]}
            >
              {c.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Label */}
      <Text style={styles.sectionLabel}>ラベル（任意）</Text>
      <TextInput
        style={styles.textInput}
        placeholder="例：ランチ代"
        value={label}
        onChangeText={setLabel}
      />

      {/* Fixed toggle */}
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>固定費として記録</Text>
        <Switch
          value={isFixed}
          onValueChange={setIsFixed}
          trackColor={{ true: Colors.primary }}
        />
      </View>

      {/* Save */}
      <Pressable
        style={[styles.saveButton, (!amount || parseInt(amount) <= 0) && styles.saveDisabled]}
        onPress={handleSave}
        disabled={!amount || parseInt(amount) <= 0}
      >
        <Text style={styles.saveText}>{Strings.save}</Text>
      </Pressable>
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
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 16,
  },
  yen: {
    fontSize: 32,
    fontWeight: '300',
    color: Colors.textSecondary,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.text,
    minWidth: 120,
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    width: '30%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
  },
  categoryActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '0D',
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  categoryLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveDisabled: {
    opacity: 0.4,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
