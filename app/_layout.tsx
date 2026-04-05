import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../src/constants/colors';
import { loadProfile } from '../src/services/storage';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="detail"
          options={{ headerShown: false, presentation: 'card' }}
        />
        <Stack.Screen
          name="add-expense"
          options={{
            headerShown: true,
            title: '支出を追加',
            headerTintColor: Colors.primary,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="add-subscription"
          options={{
            headerShown: true,
            title: 'サブスクを追加',
            headerTintColor: Colors.primary,
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}
