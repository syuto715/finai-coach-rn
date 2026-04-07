import React, { useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../../src/constants/colors';
import { Strings } from '../../src/constants/strings';
import { useSubscriptions } from '../../src/hooks/useSubscriptions';
import { CategoryIcon } from '../../src/components/CategoryIcon';
import { DisclaimerFooter } from '../../src/components/DisclaimerFooter';
import { formatNumber, formatDateJP } from '../../src/utils/calculations';
import type { Subscription } from '../../src/models/subscription';

export default function SubscriptionsScreen() {
  const router = useRouter();
  const {
    activeSubs,
    totalMonthly,
    unusedSubs,
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

    return (
      <Pressable style={styles.itemCard} onLongPress={() => handleDelete(item)}>
        <View style={styles.itemHeader}>
          <CategoryIcon category={item.category} size={36} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCategory}>
              {Strings.subCategories[item.category] ?? item.category}
            </Text>
          </View>
          <Text style={styles.itemPrice}>¥{formatNumber(item.monthlyPrice)}/月</Text>
        </View>

        {item.lastUsedDate && (
          <Text style={[styles.lastUsed, isUnused && styles.lastUsedWarning]}>
            最後に使用: {formatDateJP(item.lastUsedDate)}
          </Text>
        )}

        {isUnused && (
          <View style={styles.unusedBadge}>
            <Text style={styles.unusedText}>⚠️ 30日以上未使用</Text>
          </View>
        )}

        {item.memo ? <Text style={styles.memo}>{item.memo}</Text> : null}

        <View style={styles.actions}>
          <Pressable style={styles.usedButton} onPress={() => updateLastUsed(item.id)}>
            <Text style={styles.usedButtonText}>使った</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={() => handleDelete(item)}>
            <Text style={styles.deleteButtonText}>削除</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={activeSubs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>月</Text>
            <Text style={styles.totalMonthly}>¥{formatNumber(totalMonthly)}</Text>
            <Text style={styles.totalAnnual}>/ 年 ¥{formatNumber(totalMonthly * 12)}</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>サブスクを登録して棚卸ししましょう</Text>
          </View>
        }
        ListFooterComponent={
          <>
            <Pressable style={styles.addButton} onPress={() => router.push('/add-subscription')}>
              <Text style={styles.addButtonText}>{Strings.addSubscription}</Text>
            </Pressable>
          </>
        }
      />
      <DisclaimerFooter />
    </View>
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
  totalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 24,
    shadowOpacity: 1,
  },
  totalLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  totalMonthly: {
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: '500',
    color: Colors.text,
  },
  totalAnnual: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  unusedBadge: {
    backgroundColor: 'rgba(249,168,37,0.10)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  unusedText: {
    fontSize: 12,
    color: Colors.warning,
    fontWeight: '600',
  },
  itemCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 8,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 24,
    shadowOpacity: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  itemCategory: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  itemPrice: {
    fontFamily: 'Georgia',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.secondary,
  },
  lastUsed: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  lastUsedWarning: {
    color: Colors.warning,
  },
  memo: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  usedButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  usedButtonText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteButtonText: {
    fontSize: 12,
    color: Colors.error,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  addButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: Colors.textOnBrand,
    fontSize: 15,
    fontWeight: '700',
  },
});
