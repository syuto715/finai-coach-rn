import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated, type ViewStyle, type TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';

interface Props {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ title, variant = 'primary', size = 'md', onPress, disabled, style }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePress = async () => {
    if (variant === 'primary') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        style={[
          styles.base,
          sizeStyles[size],
          variantBgStyles[variant],
          disabled && styles.disabled,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        <Text style={[sizeTextStyles[size], variantTextStyles[variant]]}>
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
});

const sizeStyles: Record<string, ViewStyle> = {
  sm: { height: 36, paddingHorizontal: 12 },
  md: { height: 44, paddingHorizontal: 16 },
  lg: { height: 52, paddingHorizontal: 24 },
};

const sizeTextStyles: Record<string, TextStyle> = {
  sm: { fontSize: 13, fontWeight: '500' },
  md: { fontSize: 15, fontWeight: '600' },
  lg: { fontSize: 16, fontWeight: '600' },
};

const variantBgStyles: Record<string, ViewStyle> = {
  primary: { backgroundColor: Colors.secondary },
  secondary: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.borderStrong },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: Colors.error },
};

const variantTextStyles: Record<string, TextStyle> = {
  primary: { color: '#ffffff' },
  secondary: { color: Colors.text },
  ghost: { color: Colors.secondary },
  danger: { color: '#ffffff' },
};
