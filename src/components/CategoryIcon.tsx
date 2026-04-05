import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

const icons: Record<string, string> = {
  fixed: '🏠',
  food: '🍽️',
  transport: '🚃',
  utility: '⚡',
  entertainment: '🎬',
  subscription: '📱',
  other: '📦',
  video: '🎥',
  music: '🎵',
  news: '📰',
  tool: '🔧',
  game: '🎮',
};

interface Props {
  category: string;
  size?: number;
}

export function CategoryIcon({ category, size = 36 }: Props) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 3 }]}>
      <Text style={{ fontSize: size * 0.45 }}>{icons[category] ?? '📦'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
