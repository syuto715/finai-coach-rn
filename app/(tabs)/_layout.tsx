import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Colors } from '../../src/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.surface },
        headerTitleStyle: { fontWeight: '700', color: Colors.text },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textHint,
        tabBarStyle: { backgroundColor: Colors.surface },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: '分析',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📊</Text>,
        }}
      />
      <Tabs.Screen
        name="subscriptions"
        options={{
          title: 'サブスク',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📱</Text>,
        }}
      />
      <Tabs.Screen
        name="meter"
        options={{
          title: 'メーター',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🛡️</Text>,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '履歴',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📜</Text>,
        }}
      />
    </Tabs>
  );
}
