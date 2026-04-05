import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../src/constants/colors';
import { Strings } from '../src/constants/strings';
import { useProposal } from '../src/hooks/useProposal';
import { useExpenses } from '../src/hooks/useExpenses';
import { useSubscriptions } from '../src/hooks/useSubscriptions';
import { useProfile } from '../src/hooks/useProfile';
import { useExecutions } from '../src/hooks/useExecutions';
import { TrustBadge } from '../src/components/TrustBadge';
import { EvidenceCard } from '../src/components/EvidenceCard';
import { DisclaimerFooter } from '../src/components/DisclaimerFooter';

export default function DetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile } = useProfile();
  const { expenses } = useExpenses();
  const { subscriptions } = useSubscriptions();
  const { proposals, markExecuted } = useProposal(expenses, subscriptions, profile);
  const { addExecution } = useExecutions();

  const proposal = proposals.find((p) => p.id === id);

  if (!proposal) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>提案が見つかりませんでした</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>戻る</Text>
        </Pressable>
      </View>
    );
  }

  const handleDone = () => {
    Alert.alert(Strings.confirmDone, '実行記録が保存されます。', [
      { text: Strings.cancel, style: 'cancel' },
      {
        text: Strings.actionDone,
        onPress: async () => {
          await markExecuted(proposal.id);
          await addExecution(proposal.id, proposal.title);
          router.back();
        },
      },
    ]);
  };

  const scopeText = proposal.applicableScope || '一般的な傾向に基づく参考情報です';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerBar}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>{proposal.title}</Text>
        </View>

        {/* Body */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>提案内容</Text>
          <Text style={styles.bodyText}>{proposal.body}</Text>
        </View>

        {/* Trust Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>信頼性・適用範囲</Text>
          <View style={styles.trustRow}>
            <Text style={styles.trustLabel}>信頼度</Text>
            <TrustBadge level={proposal.trustLevel} />
          </View>
          <View style={styles.divider} />
          <View style={styles.trustRow}>
            <Text style={styles.trustLabel}>適用範囲</Text>
            <Text style={styles.trustValue}>{scopeText}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.trustRow}>
            <Text style={styles.trustLabel}>専門家相談</Text>
            <Text style={styles.trustValue}>{Strings.consultExpert}</Text>
          </View>
        </View>

        {/* Evidence */}
        {proposal.evidenceSource ? (
          <EvidenceCard
            sourceName={proposal.evidenceSource}
            publishedAt={proposal.evidenceDate}
            url={proposal.evidenceUrl}
          />
        ) : null}

        {/* Done button */}
        {proposal.isExecuted ? (
          <View style={styles.doneBanner}>
            <Text style={styles.doneIcon}>✅</Text>
            <Text style={styles.doneText}>実行済みです！素晴らしい！</Text>
          </View>
        ) : (
          <Pressable style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>{Strings.actionDone}</Text>
          </Pressable>
        )}
      </ScrollView>
      <DisclaimerFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  backButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: '700',
  },
  headerBar: {
    paddingTop: 48,
    paddingBottom: 8,
  },
  backArrow: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 24,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
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
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  bodyText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 24,
  },
  trustRow: {
    gap: 4,
  },
  trustLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textHint,
  },
  trustValue: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  doneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success + '14',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.success + '4D',
    padding: 20,
    gap: 8,
  },
  doneIcon: {
    fontSize: 24,
  },
  doneText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.success,
  },
  doneButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
});
