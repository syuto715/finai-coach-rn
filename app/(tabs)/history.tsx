import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Colors } from '../../src/constants/colors';
import { Strings } from '../../src/constants/strings';
import { useExecutions } from '../../src/hooks/useExecutions';
import { DisclaimerFooter } from '../../src/components/DisclaimerFooter';
import { formatDateSlash } from '../../src/utils/calculations';
import type { ExecutionRecord } from '../../src/models/execution-record';

export default function HistoryScreen() {
  const { executions } = useExecutions();

  const renderItem = ({ item }: { item: ExecutionRecord }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.doneIcon}>✅</Text>
        <Text style={styles.itemTitle}>{item.proposalTitle}</Text>
      </View>
      <Text style={styles.itemDate}>{formatDateSlash(item.executedAt)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={executions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          executions.length > 0 ? (
            <View style={styles.countCard}>
              <Text style={styles.countLabel}>合計実行回数</Text>
              <Text style={styles.countValue}>{executions.length}回</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{Strings.noHistory}</Text>
          </View>
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
    flexGrow: 1,
  },
  countCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 24,
    shadowOpacity: 1,
  },
  countLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  countValue: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '500',
    color: Colors.text,
  },
  itemCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 6,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 24,
    shadowOpacity: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  doneIcon: {
    fontSize: 14,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  itemDate: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginLeft: 22,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
