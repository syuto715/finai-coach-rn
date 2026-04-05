import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { ActionProposal } from '../models/action-proposal';
import { Colors } from '../constants/colors';
import { Strings } from '../constants/strings';
import { TrustBadge } from './TrustBadge';

interface Props {
  proposal: ActionProposal;
  onDone?: () => void;
  onDetail?: () => void;
  compact?: boolean;
}

export function ActionCard({ proposal, onDone, onDetail, compact = false }: Props) {
  const handleDone = () => {
    Alert.alert(Strings.confirmDone, '実行記録が保存されます。', [
      { text: Strings.cancel, style: 'cancel' },
      {
        text: Strings.actionDone,
        onPress: async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onDone?.();
        },
      },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.accentLine} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{proposal.title}</Text>
        <Text style={styles.body} numberOfLines={compact ? 2 : 3}>
          {proposal.body}
        </Text>
        <TrustBadge level={proposal.trustLevel} />

        {!compact && (
          <View style={styles.actions}>
            {proposal.isExecuted ? (
              <View style={styles.doneBanner}>
                <Text style={styles.doneText}>✅ 実行済み</Text>
              </View>
            ) : (
              <>
                {onDone && (
                  <Pressable style={styles.doneButton} onPress={handleDone}>
                    <Text style={styles.doneButtonText}>{Strings.actionDone}</Text>
                  </Pressable>
                )}
                {onDetail && (
                  <Pressable onPress={onDetail}>
                    <Text style={styles.detailLink}>詳細を見る</Text>
                  </Pressable>
                )}
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 24,
    shadowOpacity: 1,
  },
  accentLine: {
    height: 4,
    backgroundColor: Colors.secondary,
  },
  cardContent: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 22,
    fontWeight: '500',
    color: Colors.text,
    lineHeight: 26,
  },
  body: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  doneButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    flex: 1,
    alignItems: 'center',
  },
  doneButtonText: {
    color: Colors.textOnBrand,
    fontSize: 16,
    fontWeight: '700',
  },
  detailLink: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  doneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46,125,50,0.10)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  doneText: {
    color: Colors.success,
    fontWeight: '700',
    fontSize: 13,
  },
});
