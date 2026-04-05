import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../src/constants/colors';
import { Strings } from '../src/constants/strings';
import { useSubscriptions } from '../src/hooks/useSubscriptions';
import type { SubCategory } from '../src/models/subscription';

const subCategories: { key: SubCategory; label: string; emoji: string }[] = [
  { key: 'video', label: '動画', emoji: '🎥' },
  { key: 'music', label: '音楽', emoji: '🎵' },
  { key: 'news', label: 'ニュース', emoji: '📰' },
  { key: 'tool', label: 'ツール', emoji: '🔧' },
  { key: 'game', label: 'ゲーム', emoji: '🎮' },
  { key: 'other', label: 'その他', emoji: '📦' },
];

export default function AddSubscriptionScreen() {
  const router = useRouter();
  const { addSubscription } = useSubscriptions();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<SubCategory>('other');
  const [memo, setMemo] = useState('');

  const handleSave = async () => {
    const numPrice = parseInt(price, 10);
    if (!name.trim() || isNaN(numPrice) || numPrice <= 0) return;

    await addSubscription({
      name: name.trim(),
      monthlyPrice: numPrice,
      category,
      startDate: new Date().toISOString(),
      memo: memo.trim(),
    });

    router.back();
  };

  const canSave = name.trim() && price && parseInt(price) > 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Name */}
      <Text style={styles.label}>サービス名</Text>
      <TextInput
        style={styles.input}
        placeholder="例：Netflix"
        value={name}
        onChangeText={setName}
        autoFocus
      />

      {/* Price */}
      <Text style={styles.label}>月額（円）</Text>
      <View style={styles.priceRow}>
        <Text style={styles.yen}>¥</Text>
        <TextInput
          style={styles.priceInput}
          placeholder="0"
          keyboardType="number-pad"
          value={price}
          onChangeText={setPrice}
        />
      </View>

      {/* Category */}
      <Text style={styles.label}>カテゴリ</Text>
      <View style={styles.categoryGrid}>
        {subCategories.map((c) => (
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

      {/* Memo */}
      <Text style={styles.label}>メモ（任意）</Text>
      <TextInput
        style={styles.input}
        placeholder="解約手順など"
        value={memo}
        onChangeText={setMemo}
      />

      {/* Save */}
      <Pressable
        style={[styles.saveButton, !canSave && styles.saveDisabled]}
        onPress={handleSave}
        disabled={!canSave}
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
    gap: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  input: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  yen: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
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
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
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
