import QuickActionCard from "@/components/HomeScreen/QuickActionCard";
import RecipeGeneratorCard from "@/components/HomeScreen/RecipeGeneratorCard";
import { useProfile } from "@/hooks/useProfile";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useSelector } from "react-redux";

import Header from "@/components/HomeScreen/Header";
import { DEFAULT_CALORIE_GOAL } from "@/constants/profileDefaults";
import type { RootState } from "@/store";

export default function Home() {
  const router = useRouter();
  const { profile, loading: profileLoading, refetch } = useProfile();
  const calorieGoal = profile?.calorie_goal ?? DEFAULT_CALORIE_GOAL;

  const meals = useSelector(
    (state: RootState) => state.meals.meals
  );

  const totalCalories = meals.reduce(
    (sum, meal) => sum + meal.calories,
    0
  );

  const remainingCalories = Math.max(calorieGoal - totalCalories, 0);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  return (
    <View className="flex-1 bg-[#F4F8F5]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <StatusBar style="light" />

        <Header
          meals={meals}
          goal={calorieGoal}
          profile={profile}
          profileLoading={profileLoading}
        />

        <View className="mt-4 px-4">
          <View className="flex-row flex-wrap justify-between">
            <View className="mb-3 w-[48.5%]">
              <QuickActionCard
                icon="add-circle-outline"
                title="Add Meal"
                subtitle="Log breakfast, lunch, or snacks"
                iconColor="#0F9F67"
                iconBackgroundColor="#DCFCE7"
                onPress={() => router.push("/add-meal")}
              />
            </View>
            <View className="mb-3 w-[48.5%]">
              <QuickActionCard
                icon="pie-chart-outline"
                title="Macros"
                subtitle="Check your protein, carbs, and fats"
                iconColor="#2563EB"
                iconBackgroundColor="#DBEAFE"
                onPress={() => router.push("/(tabs)/macros")}
              />
            </View>
            <View className="w-full">
              <QuickActionCard
                icon="restaurant-outline"
                title="Meals"
                subtitle="Open today's full meal list"
                iconColor="#C2410C"
                iconBackgroundColor="#FFEDD5"
                onPress={() => router.push("/(tabs)/meals")}
              />
            </View>
          </View>
        </View>

        <View className="mt-5 px-4">
          <View>
            <Text className="text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-700">
              AI Kitchen
            </Text>
            <Text className="mt-1 text-[24px] font-black text-slate-900">
              Recipe Generator
            </Text>
            <Text className="mt-1 text-sm text-slate-500">
              Send your ingredients to Cooksy and get back a structured recipe you can actually use.
            </Text>
          </View>
        </View>

        <View className="mt-3 px-4">
          <RecipeGeneratorCard
            calorieGoal={calorieGoal}
            remainingCalories={remainingCalories}
            meals={meals}
          />
        </View>
      </ScrollView>
    </View>
  );
}
