import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../src/constants/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
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
            headerTintColor: Colors.secondary,
            headerStyle: { backgroundColor: Colors.background },
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="add-subscription"
          options={{
            headerShown: true,
            title: 'サブスクを追加',
            headerTintColor: Colors.secondary,
            headerStyle: { backgroundColor: Colors.background },
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="manage-categories"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="savings-simulator"
          options={{
            headerShown: true,
            title: '節約シミュレーター',
            headerTintColor: Colors.secondary,
            headerStyle: { backgroundColor: Colors.background },
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="monthly-report"
          options={{
            headerShown: true,
            title: '月次レポート',
            headerTintColor: Colors.secondary,
            headerStyle: { backgroundColor: Colors.background },
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}
