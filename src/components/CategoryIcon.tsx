import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

// Fallback icons for known category IDs
const fallbackIcons: Record<string, string> = {
  fixed: '🏠',
  food: '🍚',
  'eating-out': '🍽️',
  daily: '🧴',
  transport: '🚗',
  utility: '⚡',
  clothing: '👕',
  social: '🤝',
  hobby: '🎮',
  entertainment: '🎬',
  other: '📦',
  hair: '💇',
  subscription: '📱',
  video: '🎬',
  music: '🎵',
  news: '📰',
  tool: '🔧',
  game: '🎮',
};

interface Props {
  category: string;
  emoji?: string;
  size?: number;
}

export function CategoryIcon({ category, emoji, size = 36 }: Props) {
  const displayEmoji = emoji ?? fallbackIcons[category] ?? '📦';
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 3 }]}>
      <Text style={{ fontSize: size * 0.45 }}>{displayEmoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
