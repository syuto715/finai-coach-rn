import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  sourceName: string;
  publishedAt: string;
  url: string;
  userComparison?: string;
}

export function EvidenceCard({ sourceName, publishedAt, url, userComparison }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>📚</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>根拠元：{sourceName}（{publishedAt}）</Text>
        </View>
      </View>

      {userComparison ? (
        <View style={styles.comparison}>
          <Text style={styles.comparisonLabel}>あなたのデータとの比較</Text>
          <Text style={styles.comparisonText}>{userComparison}</Text>
        </View>
      ) : null}

      <View style={styles.urlBox}>
        <Text style={styles.urlIcon}>🔗</Text>
        <Text style={styles.urlText} numberOfLines={2}>{url}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary + '1F',
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  icon: {
    fontSize: 14,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  comparison: {
    gap: 4,
  },
  comparisonLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  comparisonText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  urlBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '0D',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary + '33',
    padding: 10,
    gap: 6,
  },
  urlIcon: {
    fontSize: 12,
  },
  urlText: {
    flex: 1,
    fontSize: 11,
    color: Colors.primary,
  },
});
