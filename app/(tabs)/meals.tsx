import MealCard from "@/components/Meals/MealCard";
import type { AppDispatch, RootState } from "@/store";
import { deleteMeal, fetchTodayMeals } from "@/store/mealsThunks";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import { mealCategories } from "@/data/mealCategories";
import type { MealType } from "@/data/todayMeals";

import AddMealsButton from "@/components/Buttons/AddMealsButton";
import CategoryCard from "@/components/Meals/CategoryCard";

export default function Meals() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  

  const meals = useSelector(
    (state: RootState) => state.meals.meals
  );

  const [selectedCategory, setSelectedCategory] =
    useState<MealType | null>(null);

 

  const filteredMeals = selectedCategory
    ? meals.filter((meal) => meal.meal === selectedCategory)
    : meals;
    
  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <StatusBar backgroundColor="black" />

        {/* Header */}
        <View className="p-2">
          <Text className="text-[20px] text-gray-700 font-bold">Meal Plan</Text>
          <Text className="text-[14px] text-gray-600">
            Track your nutrition
          </Text>
        </View>

        {/* Add button */}
        <AddMealsButton
          onPress={() => router.push("/add-meal")}
        />

        {/* Categories */}
        <View className="flex-row justify-between px-4 mt-4">
          {mealCategories.map((cat) => (
            <CategoryCard
              key={cat.type}
              {...cat}
              isActive={selectedCategory === cat.type}
              onPress={() =>
                setSelectedCategory(
                  selectedCategory === cat.type
                    ? null
                    : cat.type
                )
              }
            />
          ))}
        </View>
          <Text className="text-[20px] font-bold text-gray-600 ml-5 mt-4">Today's Meal</Text>
        {/* Meals list */}
        <View className="px-4 mt-2">
          {filteredMeals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal.meal}
              calories={meal.calories}
              time={meal.time}
              onDelete={() =>
                Alert.alert(
                  "Delete meal",
                  "Are you sure you want to delete this meal?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => dispatch(deleteMeal(meal.id)),
                    },
                  ]
                )
              }
              onEdit={() =>
                router.push({
                  pathname: "/add-meal",
                  params: {
                    id: meal.id,
                    meal: meal.meal,
                    calories: meal.calories.toString(),
                    time: meal.time,
                  },
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
