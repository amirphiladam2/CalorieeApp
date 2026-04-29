import MealCard from "@/components/Meals/MealCard";
import type { AppDispatch, RootState } from "@/store";
import { deleteMeal } from "@/store/mealsThunks";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import { mealCategories } from "@/data/mealCategories";
import type { MealType } from "@/data/todayMeals";

import AddMealsButton from "@/components/Buttons/AddMealsButton";
import CategoryCard from "@/components/Meals/CategoryCard";
import Ionicons from "@expo/vector-icons/Ionicons";

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

  const filteredCalories = filteredMeals.reduce(
    (sum, meal) => sum + meal.calories,
    0
  );

  const filteredLabel = selectedCategory ?? "All Meals";

  return (
    <SafeAreaView className="flex-1 bg-[#F4F8F5]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <StatusBar style="dark" />

        <View className="px-4 pt-2">
          <Text className="text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-700">
            Daily Log
          </Text>
          <Text className="mt-1 text-[28px] font-black text-slate-900">
            Meals
          </Text>
          <Text className="mt-2 text-sm leading-6 text-slate-500">
            Track calories, macros, and meal timing in one place.
          </Text>
        </View>

        <View className="mt-4 flex-row justify-between px-4">
          <View className="w-[31.5%] rounded-[22px] border border-emerald-100 bg-white p-4 shadow-sm">
            <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-slate-500">
              Meals
            </Text>
            <Text className="mt-2 text-[24px] font-black text-slate-900">
              {filteredMeals.length}
            </Text>
            <Text className="mt-1 text-xs text-slate-500">
              {selectedCategory ? filteredLabel : "Logged today"}
            </Text>
          </View>

          <View className="w-[31.5%] rounded-[22px] border border-emerald-100 bg-white p-4 shadow-sm">
            <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-slate-500">
              Calories
            </Text>
            <Text className="mt-2 text-[24px] font-black text-slate-900">
              {filteredCalories}
            </Text>
            <Text className="mt-1 text-xs text-slate-500">
              In this view
            </Text>
          </View>

          <View className="w-[31.5%] rounded-[22px] border border-emerald-100 bg-white p-4 shadow-sm">
            <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-slate-500">
              Focus
            </Text>
            <Text className="mt-2 text-base font-black text-slate-900">
              {filteredLabel}
            </Text>
            <Text className="mt-1 text-xs text-slate-500">
              Active filter
            </Text>
          </View>
        </View>

        <View className="mt-4">
          <AddMealsButton
            onPress={() => router.push("/add-meal")}
          />
        </View>

        <View className="mt-6">
          <View className="px-4">
            <Text className="text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-700">
              Browse
            </Text>
            <Text className="mt-1 text-[22px] font-black text-slate-900">
              Meal Categories
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingRight: 24 }}
            className="mt-4"
          >
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              activeOpacity={0.85}
              className="mr-3 flex-row items-center rounded-full border px-4 py-3"
              style={{
                backgroundColor: selectedCategory === null ? "#0F9F67" : "#FFFFFF",
                borderColor: selectedCategory === null ? "#0F9F67" : "#D1FAE5",
              }}
            >
              <View
                className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                style={{
                  backgroundColor:
                    selectedCategory === null ? "rgba(255,255,255,0.18)" : "#ECFDF5",
                }}
              >
                <Ionicons
                  name="fast-food-outline"
                  size={20}
                  color={selectedCategory === null ? "#FFFFFF" : "#047857"}
                />
              </View>

              <Text
                className="text-sm font-semibold"
                style={{
                  color: selectedCategory === null ? "#FFFFFF" : "#047857",
                }}
              >
                All
              </Text>
            </TouchableOpacity>

            {mealCategories.map((cat) => (
              <CategoryCard
                key={cat.type}
                {...cat}
                isActive={selectedCategory === cat.type}
                onPress={() => setSelectedCategory(cat.type)}
              />
            ))}
          </ScrollView>
        </View>

        <View className="mt-6 px-4">
          <Text className="text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-700">
            {selectedCategory ? filteredLabel : "Today"}
          </Text>
          <Text className="mt-1 text-[24px] font-black text-slate-900">
            {selectedCategory ? `${filteredLabel} Meals` : "Today's Meals"}
          </Text>
          <Text className="mt-2 text-sm text-slate-500">
            {filteredMeals.length > 0
              ? `${filteredMeals.length} meal${filteredMeals.length === 1 ? "" : "s"} logged in this view`
              : selectedCategory
                ? `No ${filteredLabel.toLowerCase()} logged yet`
                : "No meals logged yet today"}
          </Text>
        </View>

        <View className="mt-2 px-4">
          {filteredMeals.length === 0 ? (
            <View className="mt-4 rounded-[28px] border border-emerald-100 bg-white p-5">
              <Text className="text-lg font-bold text-slate-900">
                {selectedCategory ? `No ${filteredLabel} meals yet` : "No meals logged yet"}
              </Text>
              <Text className="mt-2 text-sm leading-6 text-slate-500">
                {selectedCategory
                  ? `Switch back to all meals or log a new ${filteredLabel.toLowerCase()} entry.`
                  : "Start adding meals to build your daily calorie and macro timeline."}
              </Text>

              <View className="mt-4 flex-row">
                {selectedCategory ? (
                  <TouchableOpacity
                    onPress={() => setSelectedCategory(null)}
                    activeOpacity={0.85}
                    className="mr-3 rounded-full bg-slate-100 px-4 py-3"
                  >
                    <Text className="text-sm font-semibold text-slate-700">
                      Show all meals
                    </Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  onPress={() => router.push("/add-meal")}
                  activeOpacity={0.85}
                  className="rounded-full bg-emerald-600 px-4 py-3"
                >
                  <Text className="text-sm font-semibold text-white">
                    Add meal
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            filteredMeals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal.meal}
                calories={meal.calories}
                time={meal.time}
                protein={meal.protein}
                carbs={meal.carbs}
                fats={meal.fats}
                recipeTitle={meal.recipe_title}
                recipeSummary={meal.recipe_summary}
                recipeServings={meal.recipe_servings}
                recipeSourcePrompt={meal.recipe_source_prompt}
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
                      protein: meal.protein?.toString() ?? "",
                      carbs: meal.carbs?.toString() ?? "",
                      fats: meal.fats?.toString() ?? "",
                      recipeTitle: meal.recipe_title ?? "",
                      recipeSummary: meal.recipe_summary ?? "",
                      recipeServings: meal.recipe_servings?.toString() ?? "",
                      recipeSourcePrompt: meal.recipe_source_prompt ?? "",
                    },
                  })
                }
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
