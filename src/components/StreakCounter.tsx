import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  streak: number;
  color: string;
  label: string;
}

export function StreakCounter({ streak, color, label }: Props) {
  return (
    <View style={styles.container}>
      <Text style={[styles.fire, { opacity: streak === 0 ? 0.3 : 1 }]}>🔥</Text>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  fire: {
    fontSize: 18,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});
