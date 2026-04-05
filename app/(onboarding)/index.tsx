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
import { Strings } from '../../src/constants/strings';
import { saveProfile } from '../../src/services/storage';
import { defaultProfile } from '../../src/models/user-profile';

const { width } = Dimensions.get('window');

const slides = [
  { emoji: '🎯', title: '毎月たった1つの行動を', sub: '無理なく家計を改善' },
  { emoji: '📋', title: 'やるべきことが明確に', sub: '根拠あるアドバイス' },
  { emoji: '🚀', title: '実行するたびに家計が改善', sub: '行動の積み重ねが力に' },
];

export default function OnboardingIntro() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [page, setPage] = useState(0);
  const [nickname, setNickname] = useState('');
  const isLastSlide = page === slides.length;

  const handleNext = () => {
    if (page < slides.length) {
      flatListRef.current?.scrollToIndex({ index: page + 1, animated: true });
    }
  };

  const handleStart = async () => {
    if (!nickname.trim()) return;
    await saveProfile({
      ...defaultProfile,
      nickname: nickname.trim(),
      createdAt: new Date().toISOString(),
    });
    router.replace('/(onboarding)/diagnosis');
  };

  const data = [...slides, { emoji: '', title: '', sub: '' }]; // extra page for nickname

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setPage(idx);
        }}
        renderItem={({ item, index }) => (
          <View style={styles.slide}>
            {index < slides.length ? (
              <>
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.sub}>{item.sub}</Text>
              </>
            ) : (
              <>
                <Text style={styles.emoji}>👋</Text>
                <Text style={styles.title}>ニックネームを教えてください</Text>
                <TextInput
                  style={styles.input}
                  placeholder="例：たろう"
                  value={nickname}
                  onChangeText={setNickname}
                  returnKeyType="done"
                  maxLength={20}
                />
              </>
            )}
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {data.map((_, i) => (
          <View key={i} style={[styles.dot, page === i && styles.dotActive]} />
        ))}
      </View>

      {/* Button */}
      <Pressable
        style={[styles.button, isLastSlide && !nickname.trim() && styles.buttonDisabled]}
        onPress={isLastSlide ? handleStart : handleNext}
        disabled={isLastSlide && !nickname.trim()}
      >
        <Text style={styles.buttonText}>
          {isLastSlide ? Strings.diagnosisStart : '次へ'}
        </Text>
      </Pressable>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  sub: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginTop: 20,
    color: Colors.text,
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
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    marginHorizontal: 24,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
