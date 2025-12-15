import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

// 1. Import the standard icon library
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      
      {/* 1. Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
        }}
      />

      {/* 2. Learn Tab */}
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          // 'school' is a standard icon for learning/education
          tabBarIcon: ({ color }) => <Ionicons size={28} name="school" color={color} />,
        }}
      />

      {/* 3. Quiz Tab */}
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          // 'help-circle' or 'chatbubbles' works great for quiz/questions
          tabBarIcon: ({ color }) => <Ionicons size={28} name="help-circle" color={color} />,
        }}
      />

      {/* 4. Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          // 'person-circle' is the standard user profile icon
          tabBarIcon: ({ color }) => <Ionicons size={28} name="person-circle" color={color} />,
        }}
      />
    </Tabs>
  );
}