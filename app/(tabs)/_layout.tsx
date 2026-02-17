import { Tabs, useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { Ionicons, Foundation } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { fetchTodayMeals } from "@/store/mealsThunks";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";

export default function TabLayout() {
  const { loading, session, user } = useAuth();
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (user) {
      dispatch(fetchTodayMeals(user.id));
    }
  }, [user]);

  // Redirect must be inside useEffect
  useEffect(() => {
    if (!loading && !session) {
      router.replace("/(auth)/AuthScreen");
    }
  }, [loading, session]);

  // While auth is loading OR session is null (waiting for redirect), show spinner
  if (loading || !session) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0e3a02ff" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#08b67fff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="meals"
        options={{
          title: 'Meals',
          tabBarLabel: 'Meals',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={'fast-food'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="macros"
        options={{
          title: 'Macros',
          tabBarLabel: 'Macros',
          tabBarIcon: ({ color, focused }) => (
            <Foundation
              name={'graph-pie'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
