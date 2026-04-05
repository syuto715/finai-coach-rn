import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
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
  } = useSubscriptions();

  const handleDelete = (sub: Subscription) => {
    Alert.alert('サブスクを解約', `「${sub.name}」を解約済みにしますか？`, [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '解約する',
        style: 'destructive',
        onPress: () => deleteSubscription(sub.id),
      },
    ]);
  };

  const renderItem = ({ item }: { item: Subscription }) => {
    const isUnused = !item.lastUsedDate || (Date.now() - new Date(item.lastUsedDate).getTime()) / 86400000 > 30;

    return (
      <View style={styles.itemCard}>
        <View style={styles.itemHeader}>
          <CategoryIcon category={item.category} size={36} />
          <View style={styles.itemInfo}>
            <View style={styles.nameRow}>
              {isUnused && <Text style={styles.warningBadge}>⚠️</Text>}
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
            <Text style={styles.itemCategory}>
              {Strings.subCategories[item.category] ?? item.category}
            </Text>
          </View>
          <Text style={styles.itemPrice}>¥{formatNumber(item.monthlyPrice)}/月</Text>
        </View>

        {item.lastUsedDate && (
          <Text style={[styles.lastUsed, isUnused && { color: Colors.warning }]}>
            最後に使用: {formatDateJP(item.lastUsedDate)}
          </Text>
        )}

        {item.memo ? <Text style={styles.memo}>{item.memo}</Text> : null}

        <View style={styles.actions}>
          <Pressable style={styles.usedButton} onPress={() => updateLastUsed(item.id)}>
            <Text style={styles.usedButtonText}>✓ 使った</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={() => handleDelete(item)}>
            <Text style={styles.deleteButtonText}>解約</Text>
          </Pressable>
        </View>
      </View>
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
          <>
            {/* Total Card */}
            <View style={styles.totalCard}>
              <Text style={styles.totalMonthly}>月 {formatNumber(totalMonthly)}円</Text>
              <Text style={styles.totalAnnual}>年 {formatNumber(totalMonthly * 12)}円</Text>
            </View>

            {/* Unused alert */}
            {unusedSubs.length > 0 && (
              <View style={styles.alertBox}>
                <Text style={styles.alertIcon}>⚠️</Text>
                <Text style={styles.alertText}>
                  {unusedSubs.length}件のサブスクが30日以上使われていません
                </Text>
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📱</Text>
            <Text style={styles.emptyText}>{Strings.noSubscriptions}</Text>
          </View>
        }
        ListFooterComponent={
          <Pressable style={styles.addButton} onPress={() => router.push('/add-subscription')}>
            <Text style={styles.addButtonText}>{Strings.addSubscription}</Text>
          </Pressable>
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
    padding: 16,
    gap: 12,
    paddingBottom: 24,
  },
  totalCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 4,
  },
  totalMonthly: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  totalAnnual: {
    fontSize: 15,
    color: '#FFFFFFCC',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '1A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.warning + '4D',
    padding: 12,
    gap: 8,
  },
  alertIcon: {
    fontSize: 16,
  },
  alertText: {
    flex: 1,
    fontSize: 12,
    color: Colors.warning,
  },
  itemCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  warningBadge: {
    fontSize: 12,
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
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  lastUsed: {
    fontSize: 12,
    color: Colors.textHint,
  },
  memo: {
    fontSize: 12,
    color: Colors.textHint,
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
  emptyIcon: {
    fontSize: 48,
    opacity: 0.3,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
