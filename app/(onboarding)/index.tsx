import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { saveProfile } from '../../src/services/storage';
import { defaultProfile } from '../../src/models/user-profile';
import { Button } from '../../src/components/Button';

const { width } = Dimensions.get('window');

const slides = [
  { emoji: '🎯', title: '毎月たった1つの行動を', sub: '無理なく家計を改善できます' },
  { emoji: '📋', title: 'やるべきことが明確に', sub: '根拠あるアドバイスをお届けします' },
  { emoji: '🚀', title: '実行するたびに家計が改善', sub: '行動の積み重ねが力になります' },
];

export default function OnboardingIntro() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [page, setPage] = useState(0);
  const [nickname, setNickname] = useState('');
  const isLastSlide = page === slides.length - 1;

  const handleStart = async () => {
    if (!nickname.trim()) return;
    await saveProfile({
      ...defaultProfile,
      nickname: nickname.trim(),
      createdAt: new Date().toISOString(),
    });
    router.replace('/(onboarding)/diagnosis');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setPage(idx);
        }}
        renderItem={({ item, index }) => (
          <View style={styles.slide}>
            <View style={styles.slideTop}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <View style={styles.slideBottom}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.sub}>{item.sub}</Text>

              {index === slides.length - 1 && (
                <TextInput
                  style={styles.input}
                  placeholder="ニックネームを入力"
                  placeholderTextColor={Colors.textTertiary}
                  value={nickname}
                  onChangeText={setNickname}
                  returnKeyType="done"
                  maxLength={20}
                  textAlign="center"
                />
              )}
            </View>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, page === i && styles.dotActive]} />
        ))}
      </View>

      {/* Button */}
      {isLastSlide ? (
        <View style={styles.buttonContainer}>
          <Button
            title="診断を始める"
            variant="primary"
            size="lg"
            onPress={handleStart}
            disabled={!nickname.trim()}
            style={styles.startButton}
          />
        </View>
      ) : (
        <View style={styles.buttonPlaceholder} />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingBottom: 60,
  },
  slide: {
    width,
    flex: 1,
  },
  slideTop: {
    flex: 1,
    backgroundColor: Colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideBottom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 80,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: 17,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  input: {
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: Colors.secondary,
    paddingVertical: 12,
    fontSize: 20,
    marginTop: 24,
    color: Colors.text,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderStrong,
  },
  dotActive: {
    backgroundColor: Colors.secondary,
    width: 24,
  },
  buttonContainer: {
    marginHorizontal: 20,
  },
  startButton: {
    width: '100%',
  },
  buttonPlaceholder: {
    height: 52,
    marginHorizontal: 20,
  },
});
