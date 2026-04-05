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
      <Text style={styles.title}>参考：{sourceName}</Text>
      <Text style={styles.date}>{publishedAt}</Text>

      {userComparison ? (
        <Text style={styles.comparison}>{userComparison}</Text>
      ) : null}

      <Text style={styles.url} numberOfLines={2}>{url}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.border,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.secondary,
    padding: 16,
    gap: 4,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  date: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  comparison: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
  url: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 4,
  },
});
