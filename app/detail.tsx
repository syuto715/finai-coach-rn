import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '../src/constants/colors';
import { Strings } from '../src/constants/strings';
import { useProposal } from '../src/hooks/useProposal';
import { useExpenses } from '../src/hooks/useExpenses';
import { useSubscriptions } from '../src/hooks/useSubscriptions';
import { useProfile } from '../src/hooks/useProfile';
import { useCategories } from '../src/hooks/useCategories';
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
  const { categories } = useCategories();
  const { proposals, markExecuted } = useProposal(expenses, subscriptions, profile, categories);
  const { addExecution } = useExecutions();

  // Find by id, or fallback to latest proposal
  const proposal = id
    ? proposals.find((p) => p.id === id)
    : proposals.length > 0 ? proposals[proposals.length - 1] : null;

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
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          await markExecuted(proposal.id);
          await addExecution(proposal.id, proposal.title);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerBar}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
        </View>

        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroAccent} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{proposal.title}</Text>
          </View>
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
            <Text style={styles.trustValue}>{proposal.applicableScope}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.trustRow}>
            <Text style={styles.trustLabel}>専門家コメント</Text>
            <Text style={styles.trustValue}>{proposal.expertNote}</Text>
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
            <Text style={styles.doneBannerText}>✅ 実行済み</Text>
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
    padding: 20,
    gap: 16,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  backButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  headerBar: {
    paddingTop: 48,
    paddingBottom: 8,
  },
  backArrow: {
    fontSize: 24,
    color: Colors.secondary,
    fontWeight: '700',
  },
  heroCard: {
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
  heroAccent: {
    height: 4,
    backgroundColor: Colors.secondary,
  },
  heroContent: {
    padding: 24,
  },
  heroTitle: {
    fontFamily: 'Georgia',
    fontSize: 22,
    fontWeight: '500',
    color: Colors.text,
    lineHeight: 26,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    gap: 12,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 24,
    shadowOpacity: 1,
  },
  cardTitle: {
    fontFamily: 'Georgia',
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  bodyText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 24,
  },
  trustRow: {
    gap: 4,
  },
  trustLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textTertiary,
  },
  trustValue: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  doneBanner: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(46,125,50,0.10)',
    borderRadius: 16,
    padding: 20,
  },
  doneBannerText: {
    fontSize: 16,
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
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
});
