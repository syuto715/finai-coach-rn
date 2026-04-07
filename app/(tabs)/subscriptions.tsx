import React, { useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../../src/constants/colors';
import { Shadows } from '../../src/constants/shadows';
import { Strings } from '../../src/constants/strings';
import { useSubscriptions } from '../../src/hooks/useSubscriptions';
import { DisclaimerFooter } from '../../src/components/DisclaimerFooter';
import { EmptyState } from '../../src/components/EmptyState';
import { Button } from '../../src/components/Button';
import { formatNumber, formatDateJP } from '../../src/utils/calculations';
import type { Subscription } from '../../src/models/subscription';

const subCategoryEmoji: Record<string, string> = {
  video: '🎬',
  music: '🎵',
  news: '📰',
  tool: '🛠',
  game: '🎮',
  other: '📦',
};

export default function SubscriptionsScreen() {
  const router = useRouter();
  const {
    activeSubs,
    totalMonthly,
    updateLastUsed,
    deleteSubscription,
    reload: reloadSubscriptions,
  } = useSubscriptions();

  useFocusEffect(
    useCallback(() => {
      reloadSubscriptions();
    }, [reloadSubscriptions]),
  );

  const handleDelete = (sub: Subscription) => {
    Alert.alert('サブスクを削除', `「${sub.name}」を削除しますか？`, [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除する',
        style: 'destructive',
        onPress: () => deleteSubscription(sub.id),
      },
    ]);
  };

  const renderItem = ({ item }: { item: Subscription }) => {
    const isUnused = !item.lastUsedDate || (Date.now() - new Date(item.lastUsedDate).getTime()) / 86400000 > 30;
    const emoji = subCategoryEmoji[item.category] ?? '📦';

    return (
      <View style={styles.itemCard}>
        <View style={styles.itemRow}>
          <View style={styles.emojiCircle}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemMeta}>
              {item.lastUsedDate ? `最終利用: ${formatDateJP(item.lastUsedDate)}` : '未使用'}
            </Text>
          </View>
          <View style={styles.itemRight}>
            <Text style={styles.itemPrice}>¥{formatNumber(item.monthlyPrice)}</Text>
            {isUnused && <View style={styles.redDot} />}
          </View>
        </View>
        <View style={styles.actions}>
          <Pressable style={styles.usedButton} onPress={() => updateLastUsed(item.id)}>
            <Text style={styles.usedButtonText}>使った</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={() => handleDelete(item)}>
            <Text style={styles.deleteButtonText}>削除</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={activeSubs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.pageTitle}>サブスク</Text>
            <View style={styles.totalCard}>
              <View>
                <Text style={styles.totalLabel}>月額合計</Text>
                <Text style={styles.totalAmount}>¥{formatNumber(totalMonthly)}</Text>
              </View>
              <Text style={styles.totalAnnual}>年間 ¥{formatNumber(totalMonthly * 12)}</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            emoji="🔄"
            title="サブスクを登録しましょう"
            description="サブスクを登録して定期的に棚卸ししましょう"
            ctaLabel="＋ サブスクを追加"
            onCta={() => router.push('/add-subscription')}
          />
        }
        ListFooterComponent={
          activeSubs.length > 0 ? (
            <Button
              title={Strings.addSubscription}
              variant="primary"
              size="lg"
              onPress={() => router.push('/add-subscription')}
              style={styles.addBtn}
            />
          ) : null
        }
      />
      <DisclaimerFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: 20,
    gap: 12,
    paddingBottom: 24,
  },
  pageTitle: {
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 34,
    letterSpacing: -0.3,
    marginBottom: 16,
  },
  totalCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    ...Shadows.md,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  totalAmount: {
    fontFamily: 'Georgia',
    fontSize: 36,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 40,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  totalAnnual: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
  itemCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    ...Shadows.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emojiCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  itemMeta: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontFamily: 'Georgia',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.error,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  usedButton: {
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  usedButtonText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: Colors.errorLight,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  deleteButtonText: {
    fontSize: 13,
    color: Colors.error,
    fontWeight: '500',
  },
  addBtn: {
    marginTop: 8,
  },
});
