import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
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
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{proposal.title}</Text>
      <Text style={styles.body} numberOfLines={compact ? 2 : 3}>
        {proposal.body}
      </Text>
      <TrustBadge level={proposal.trustLevel} />

      {!compact && (
        <View style={styles.actions}>
          {proposal.isExecuted ? (
            <View style={styles.doneBanner}>
              <Text style={styles.doneIcon}>✅</Text>
              <Text style={styles.doneText}>実行済み</Text>
            </View>
          ) : (
            <>
              {onDone && (
                <Pressable style={styles.doneButton} onPress={onDone}>
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
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  body: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  doneButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 14,
    flex: 1,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  detailLink: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  doneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '14',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  doneIcon: {
    fontSize: 14,
  },
  doneText: {
    color: Colors.success,
    fontWeight: '700',
    fontSize: 13,
  },
});
