import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Switch, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '../src/constants/colors';
import { Strings } from '../src/constants/strings';
import { useExpenses } from '../src/hooks/useExpenses';
import { useCategories } from '../src/hooks/useCategories';

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Amount */}
      <View style={styles.amountSection}>
        <Text style={styles.yen}>¥</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="0"
          placeholderTextColor={Colors.textTertiary}
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
        {/* Edit categories button */}
        <Pressable
          style={styles.editCategoryButton}
          onPress={() => router.push('/manage-categories')}
        >
          <Text style={styles.editCategoryEmoji}>✏️</Text>
          <Text style={styles.editCategoryLabel}>追加/編集</Text>
        </Pressable>
      </View>

      {/* Label */}
      <Text style={styles.sectionLabel}>ラベル（任意）</Text>
      <TextInput
        style={styles.textInput}
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
          trackColor={{ true: Colors.primary, false: Colors.borderWarm }}
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
    fontFamily: 'Georgia',
    fontSize: 48,
    fontWeight: '500',
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
    backgroundColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
  },
  categoryActive: {
    backgroundColor: Colors.secondary,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  categoryLabelActive: {
    color: Colors.textOnBrand,
    fontWeight: '700',
  },
  editCategoryButton: {
    width: '30%',
    backgroundColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.borderWarm,
    borderStyle: 'dashed',
  },
  editCategoryEmoji: {
    fontSize: 20,
  },
  editCategoryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderWarm,
    borderRadius: 12,
    paddingHorizontal: 16,
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
    fontSize: 14,
    color: Colors.text,
  },
  saveButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveDisabled: {
    opacity: 0.4,
  },
  saveText: {
    color: Colors.textOnBrand,
    fontSize: 16,
    fontWeight: '700',
  },
});
