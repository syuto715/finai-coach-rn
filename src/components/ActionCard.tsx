import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { ActionProposal } from '../models/action-proposal';
import { Colors } from '../constants/colors';
import { Shadows } from '../constants/shadows';
import { Strings } from '../constants/strings';
import { TrustBadge } from './TrustBadge';

interface Props {
  proposal: ActionProposal;
  onDone?: () => void;
  onDetail?: () => void;
  onSimulate?: () => void;
  compact?: boolean;
}

export function ActionCard({ proposal, onDone, onDetail, onSimulate, compact = false }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleDone = () => {
    Alert.alert(Strings.confirmDone, '実行記録が保存されます。', [
      { text: Strings.cancel, style: 'cancel' },
      {
        text: Strings.actionDone,
        onPress: async () => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Animated.sequence([
            Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, speed: 50 }),
            Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }),
          ]).start();
          onDone?.();
        },
      },
    ]);
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.accentLine} />
      <View style={styles.cardContent}>
        <TrustBadge level={proposal.trustLevel} />
        <Text style={styles.title}>{proposal.title}</Text>
        <Text style={styles.body} numberOfLines={compact ? 2 : 3}>
          {proposal.body}
        </Text>

        {!compact && (
          <View style={styles.actions}>
            {proposal.isExecuted ? (
              <View style={styles.doneBanner}>
                <Text style={styles.doneText}>✅ 実行済み</Text>
              </View>
            ) : (
              <>
                {onDone && (
                  <DoneButton onPress={handleDone} />
                )}
                {onDetail && (
                  <Pressable style={styles.ghostButton} onPress={onDetail}>
                    <Text style={styles.ghostButtonText}>詳しく</Text>
                  </Pressable>
                )}
              </>
            )}
          </View>
        )}

        {!compact && onSimulate && !proposal.isExecuted && (
          <Pressable onPress={onSimulate}>
            <Text style={styles.simulateLink}>💰 節約効果を見る</Text>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

function DoneButton({ onPress }: { onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={[styles.doneButtonWrap, { transform: [{ scale }] }]}>
      <Pressable
        style={styles.doneButton}
        onPress={onPress}
        onPressIn={() => {
          Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
        }}
        onPressOut={() => {
          Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
        }}
      >
        <Text style={styles.doneButtonText}>{Strings.actionDone}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.secondaryLight,
    borderRadius: 16,
    overflow: 'hidden',
    ...Shadows.md,
  },
  accentLine: {
    position: 'absolute',
    left: 0,
    top: 16,
    bottom: 16,
    width: 4,
    borderRadius: 2,
    backgroundColor: Colors.secondary,
  },
  cardContent: {
    padding: 20,
    paddingLeft: 24,
    gap: 10,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 26,
  },
  body: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  doneButtonWrap: {
    flex: 2,
  },
  doneButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  ghostButton: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostButtonText: {
    color: Colors.secondary,
    fontSize: 15,
    fontWeight: '600',
  },
  doneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
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
  simulateLink: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
