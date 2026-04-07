import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../../src/constants/colors';
import { Shadows } from '../../src/constants/shadows';
import { Strings } from '../../src/constants/strings';
import { useExecutions } from '../../src/hooks/useExecutions';
import { DisclaimerFooter } from '../../src/components/DisclaimerFooter';
import { EmptyState } from '../../src/components/EmptyState';
import { formatDateSlash } from '../../src/utils/calculations';
import type { ExecutionRecord } from '../../src/models/execution-record';

export default function HistoryScreen() {
  const { executions, reload: reloadExecutions } = useExecutions();

  useFocusEffect(
    useCallback(() => {
      reloadExecutions();
    }, [reloadExecutions]),
  );

  const renderItem = ({ item }: { item: ExecutionRecord }) => (
    <View style={styles.item}>
      <View style={styles.iconCircle}>
        <Text style={styles.checkIcon}>✅</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.proposalTitle}</Text>
        <Text style={styles.itemDate}>{formatDateSlash(item.executedAt)}</Text>
      </View>
    </View>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={executions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            <Text style={styles.pageTitle}>実行履歴</Text>
            {executions.length > 0 && (
              <Text style={styles.subtitle}>
                合計 {executions.length}回のアクションを実行
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            emoji="📋"
            title="まだ履歴がありません"
            description="アクションを実行すると記録されます"
          />
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
    paddingBottom: 24,
    flexGrow: 1,
  },
  headerSection: {
    marginBottom: 20,
  },
  pageTitle: {
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    fontSize: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
  itemDate: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
  },
});
