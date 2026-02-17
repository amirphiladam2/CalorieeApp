import { useProfile } from "@/hooks/useProfile";
import React from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import Header from "@/components/HomeScreen/Header";
import MealCard from "@/components/Meals/MealCard";
import type { RootState } from "@/store";

export default function Home() {
  const { profile } = useProfile();
  const calorieGoal = profile?.calorie_goal ?? 2000;

  const meals = useSelector(
    (state: RootState) => state.meals.meals
  );

  const macroTotals = meals.reduce(
    (acc, meal) => ({
      protein: acc.protein + (meal.protein ?? 0),
      carbs: acc.carbs + (meal.carbs ?? 0),
      fats: acc.fats + (meal.fats ?? 0),
    }),
    { protein: 0, carbs: 0, fats: 0 }
  );

  const loading =
    useSelector((state: RootState) => state.meals.loading) ?? false;


  const totalCalories = meals.reduce(
    (sum, meal) => sum + meal.calories,
    0
  );

  const previewMeals = meals.slice(0, 4);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <StatusBar backgroundColor="#0df2aaff" />

        <Header meals={meals} goal={calorieGoal} />

        <Text className="px-4 text-[20px] text-gray-700 font-semibold mt-6">
          Today's Meal
        </Text>

        <View className="mt-2 px-4">
          {loading && (
            <Text className="text-center mt-4">
              Loading...
            </Text>
          )}

          {!loading && meals.length === 0 && (
            <Text className="text-center text-gray-400 mt-4">
              No meals logged for today
            </Text>
          )}

          {previewMeals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal.meal}
              calories={meal.calories}
              time={meal.time}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
