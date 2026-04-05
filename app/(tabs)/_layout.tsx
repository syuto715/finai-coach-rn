import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Colors } from '../../src/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTitleStyle: { fontFamily: 'Georgia', fontWeight: '500', color: Colors.text },
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ホーム',
          headerShown: false,
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
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🔄</Text>,
        }}
      />
      <Tabs.Screen
        name="meter"
        options={{
          title: 'メーター',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🎯</Text>,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '履歴',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text>,
        }}
      />
    </Tabs>
  );
}
