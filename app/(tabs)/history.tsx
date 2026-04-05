import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Colors } from '../../src/constants/colors';
import { Strings } from '../../src/constants/strings';
import { useExecutions } from '../../src/hooks/useExecutions';
import { DisclaimerFooter } from '../../src/components/DisclaimerFooter';
import { formatDateJP } from '../../src/utils/calculations';
import type { ExecutionRecord } from '../../src/models/execution-record';

export default function HistoryScreen() {
  const { executions, loading } = useExecutions();

  const renderItem = ({ item }: { item: ExecutionRecord }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.doneIcon}>✅</Text>
        <Text style={styles.itemTitle}>{item.proposalTitle}</Text>
      </View>
      <Text style={styles.itemDate}>{formatDateJP(item.executedAt)}</Text>
      {item.memo ? <Text style={styles.itemMemo}>{item.memo}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={executions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📜</Text>
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
    padding: 16,
    gap: 12,
    paddingBottom: 24,
    flexGrow: 1,
  },
  itemCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
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
    color: Colors.textHint,
    marginLeft: 22,
  },
  itemMemo: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 22,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    opacity: 0.3,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
});
