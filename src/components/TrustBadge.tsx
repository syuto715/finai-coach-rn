import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { TrustLevel } from '../models/action-proposal';
import { Colors } from '../constants/colors';

interface Props {
  level: TrustLevel;
}

const config: Record<TrustLevel, { label: string; color: string; bg: string }> = {
  high: { label: '信頼度：高', color: Colors.trustHigh, bg: Colors.successLight },
  medium: { label: '信頼度：中', color: Colors.trustMedium, bg: Colors.warningLight },
  low: { label: '信頼度：低', color: Colors.trustLow, bg: 'rgba(158,157,151,0.12)' },
};

export function TrustBadge({ level }: Props) {
  const c = config[level];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
});
