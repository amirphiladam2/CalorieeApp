import type { Meal } from "@/data/todayMeals";
import {MaterialCommunityIcons,Ionicons} from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  buildRecipeNotes,
  generateRecipe,
  parseIngredientInput,
  type GeneratedRecipe,
} from "@/services/recipeGenerator";
import {
  listSavedRecipes,
  saveRecipe,
  stageRecipeDraft,
  type StoredRecipe,
} from "@/services/recipeBook";
import { buildMealPrefillFromRecipe } from "@/utils/recipeMealPrefill";

type RecipeGeneratorCardProps = {
  calorieGoal: number;
  remainingCalories: number;
  meals: Meal[];
};

export default function RecipeGeneratorCard({
  calorieGoal,
  remainingCalories,
  meals,
}: RecipeGeneratorCardProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");
  const [lastIngredients, setLastIngredients] = useState<string[]>([]);
  const [savedRecipeId, setSavedRecipeId] = useState<string | null>(null);
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<StoredRecipe[]>([]);

  const suggestions = [
    "chicken, rice, spinach, garlic",
    "eggs, bread, avocado, tomato",
    "tofu, soy sauce, broccoli, noodles",
  ];

  const loadSavedRecipes = useCallback(async () => {
    const nextRecipes = await listSavedRecipes(3);
    setSavedRecipes(nextRecipes);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadSavedRecipes();
    }, [loadSavedRecipes])
  );

  const handleGenerate = async (seedPrompt?: string) => {
    const nextPrompt = (seedPrompt ?? prompt).trim();
    const ingredients = parseIngredientInput(nextPrompt);

    if (ingredients.length === 0) {
      Alert.alert("Add ingredients", "Enter a few ingredients separated by commas or lines.");
      return;
    }

    try {
      setLoading(true);
      const result = await generateRecipe({
        ingredients,
        calorieTarget: remainingCalories > 0 ? remainingCalories : calorieGoal,
        notes: buildRecipeNotes(meals),
        servings: 2,
      });

      await stageRecipeDraft({
        recipe: result,
        prompt: ingredients.join(", "),
        ingredients,
      });

      setRecipe(result);
      setLastPrompt(ingredients.join(", "));
      setLastIngredients(ingredients);
      setSavedRecipeId(null);
      setPrompt(ingredients.join(", "));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Recipe generation failed.";
      Alert.alert("Unable to generate recipe", message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!recipe || lastIngredients.length === 0) {
      return;
    }

    try {
      setSavingRecipe(true);

      const saved = await saveRecipe({
        recipe,
        prompt: lastPrompt,
        ingredients: lastIngredients,
      });

      setSavedRecipeId(saved.id);
      await loadSavedRecipes();

      Alert.alert("Recipe saved", "You can reopen it anytime from your saved recipe list.");
    } catch (error) {
      Alert.alert(
        "Unable to save recipe",
        error instanceof Error ? error.message : "Saving failed."
      );
    } finally {
      setSavingRecipe(false);
    }
  };

  const handleOpenRecipe = (id?: string | null) => {
    if (id) {
      router.push({
        pathname: "/recipe",
        params: { id },
      });
      return;
    }

    router.push("/recipe");
  };

  const handleLogRecipeAsMeal = () => {
    if (!recipe) {
      return;
    }

    router.push({
      pathname: "/add-meal",
      params: buildMealPrefillFromRecipe(recipe, {
        sourcePrompt: lastPrompt,
      }),
    });
  };

  return (
    <View className="overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-sm">
      <View className="bg-[#0C5A43] px-5 pb-5 pt-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <View className="self-start rounded-full border border-white/15 bg-white/10 px-3 py-1">
              <Text className="text-[11px] font-semibold uppercase tracking-[1.5px] text-emerald-100">
                Cooksy
              </Text>
            </View>

            <Text className="mt-3 text-[24px] font-black text-white">
              Recipe Generator
            </Text>
            <Text className="mt-2 text-sm leading-6 text-emerald-50/85">
              Enter ingredients you already have and Cooksy will turn them into a recipe that fits your day.
            </Text>
          </View>

          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <MaterialCommunityIcons name="robot-happy" size={24} color="#DCFCE7" />
          </View>
        </View>

        <View className="mt-4 flex-row flex-wrap">
          <View className="mr-2 mb-2 rounded-full border border-white/15 bg-white/10 px-3 py-2">
            <Text className="text-xs font-semibold text-white">
              Goal {calorieGoal} cal
            </Text>
          </View>
          <View className="mr-2 mb-2 rounded-full border border-white/15 bg-white/10 px-3 py-2">
            <Text className="text-xs font-semibold text-white">
              Left {remainingCalories} cal
            </Text>
          </View>
          <View className="mb-2 rounded-full border border-white/15 bg-white/10 px-3 py-2">
            <Text className="text-xs font-semibold text-white">
              {meals.length} meals today
            </Text>
          </View>
        </View>
      </View>

      <View className="p-5">
        <View className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
          <Text className="text-[12px] font-semibold uppercase tracking-[1.5px] text-slate-500">
            Ingredients
          </Text>
          <TextInput
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Try: chicken, rice, spinach, garlic"
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
            className="mt-2 min-h-[84px] text-[15px] leading-6 text-slate-900"
          />
        </View>

        <View className="mt-4 flex-row flex-wrap">
          {suggestions.map((item) => (
            <TouchableOpacity
              key={item}
              activeOpacity={0.85}
              onPress={() => {
                setPrompt(item);
                void handleGenerate(item);
              }}
              className="mb-2 mr-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2"
            >
              <Text className="text-xs font-semibold text-emerald-700">
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => {
            void handleGenerate();
          }}
          activeOpacity={0.9}
          disabled={loading}
          className="mt-4 flex-row items-center justify-center rounded-full bg-emerald-600 px-4 py-3.5"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="restaurant-outline" size={18} color="#FFFFFF" />
              <Text className="ml-2 text-sm font-bold text-white">
                Generate Recipe
              </Text>
            </>
          )}
        </TouchableOpacity>

        {!recipe ? (
          <View className="mt-4 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-4 py-4">
            <Text className="text-sm leading-6 text-slate-500">
              Your recipe will appear here as structured ingredients, steps, and estimated nutrition.
            </Text>
          </View>
        ) : (
          <View className="mt-5">
            <View className="rounded-[24px] border border-emerald-100 bg-[#F7FBF8] p-4">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-emerald-700">
                    Latest Recipe
                  </Text>
                  <Text className="mt-2 text-[22px] font-black text-slate-900">
                    {recipe.title}
                  </Text>
                  <Text className="mt-2 text-sm leading-6 text-slate-600">
                    {recipe.summary}
                  </Text>
                </View>

                <View className="rounded-2xl bg-white px-3 py-2">
                  <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-slate-500">
                    Prompt
                  </Text>
                  <Text className="mt-1 w-20 text-right text-xs font-semibold text-slate-700">
                    {lastPrompt}
                  </Text>
                </View>
              </View>

              <View className="mt-4 flex-row flex-wrap">
                <View className="mr-2 mb-2 rounded-full bg-emerald-100 px-3 py-2">
                  <Text className="text-xs font-semibold text-emerald-700">
                    {recipe.mealType}
                  </Text>
                </View>
                <View className="mr-2 mb-2 rounded-full bg-white px-3 py-2">
                  <Text className="text-xs font-semibold text-slate-700">
                    {recipe.servings} servings
                  </Text>
                </View>
                <View className="mr-2 mb-2 rounded-full bg-white px-3 py-2">
                  <Text className="text-xs font-semibold text-slate-700">
                    Prep {recipe.prepTimeMinutes} min
                  </Text>
                </View>
                <View className="mb-2 rounded-full bg-white px-3 py-2">
                  <Text className="text-xs font-semibold text-slate-700">
                    Cook {recipe.cookTimeMinutes} min
                  </Text>
                </View>
              </View>
            </View>

            <View className="mt-4 rounded-[24px] border border-slate-200 bg-white p-4">
              <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-emerald-700">
                Estimated Nutrition
              </Text>
              <View className="mt-3 flex-row flex-wrap justify-between">
                <View className="mb-3 w-[48%] rounded-[18px] bg-slate-50 px-4 py-3">
                  <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-slate-500">
                    Calories
                  </Text>
                  <Text className="mt-2 text-xl font-black text-slate-900">
                    {recipe.estimatedNutrition.calories}
                  </Text>
                </View>
                <View className="mb-3 w-[48%] rounded-[18px] bg-slate-50 px-4 py-3">
                  <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-slate-500">
                    Protein
                  </Text>
                  <Text className="mt-2 text-xl font-black text-slate-900">
                    {recipe.estimatedNutrition.proteinGrams}g
                  </Text>
                </View>
                <View className="w-[48%] rounded-[18px] bg-slate-50 px-4 py-3">
                  <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-slate-500">
                    Carbs
                  </Text>
                  <Text className="mt-2 text-xl font-black text-slate-900">
                    {recipe.estimatedNutrition.carbsGrams}g
                  </Text>
                </View>
                <View className="w-[48%] rounded-[18px] bg-slate-50 px-4 py-3">
                  <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-slate-500">
                    Fat
                  </Text>
                  <Text className="mt-2 text-xl font-black text-slate-900">
                    {recipe.estimatedNutrition.fatGrams}g
                  </Text>
                </View>
              </View>
            </View>

            <View className="mt-4 rounded-[24px] border border-slate-200 bg-white p-4">
              <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-emerald-700">
                Ingredients
              </Text>
              <View className="mt-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <View
                    key={`${ingredient.name}-${index}`}
                    className="mb-2 rounded-[18px] bg-slate-50 px-4 py-3"
                  >
                    <Text className="text-sm font-bold text-slate-900">
                      {ingredient.amount} {ingredient.name}
                    </Text>
                    {ingredient.preparation ? (
                      <Text className="mt-1 text-sm text-slate-500">
                        {ingredient.preparation}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            </View>

            <View className="mt-4 rounded-[24px] border border-slate-200 bg-white p-4">
              <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-emerald-700">
                Steps
              </Text>
              <View className="mt-3">
                {recipe.steps.map((step, index) => (
                  <View
                    key={`${index + 1}-${step}`}
                    className="mb-3 flex-row rounded-[18px] bg-slate-50 px-4 py-4"
                  >
                    <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-emerald-600">
                      <Text className="text-sm font-bold text-white">
                        {index + 1}
                      </Text>
                    </View>
                    <Text className="flex-1 text-sm leading-6 text-slate-700">
                      {step}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {recipe.tips.length > 0 && (
              <View className="mt-4 rounded-[24px] border border-amber-200 bg-amber-50 p-4">
                <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-amber-700">
                  Tips
                </Text>
                <View className="mt-3">
                  {recipe.tips.map((tip, index) => (
                    <View key={`${index + 1}-${tip}`} className="mb-2 flex-row">
                      <View className="mr-3 mt-2 h-2 w-2 rounded-full bg-amber-500" />
                      <Text className="flex-1 text-sm leading-6 text-amber-900">
                        {tip}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View className="mt-4 flex-row">
              <TouchableOpacity
                onPress={() => handleOpenRecipe(savedRecipeId)}
                activeOpacity={0.85}
                className="mr-3 flex-1 items-center justify-center rounded-full border border-emerald-200 bg-white px-4 py-3.5"
              >
                <Text className="text-sm font-bold text-emerald-700">
                  View Details
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  void handleSaveRecipe();
                }}
                activeOpacity={0.9}
                disabled={savingRecipe}
                className={`flex-1 items-center justify-center rounded-full px-4 py-3.5 ${
                  savedRecipeId ? "bg-slate-200" : "bg-[#032E16]"
                }`}
              >
                {savingRecipe ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text
                    className={`text-sm font-bold ${
                      savedRecipeId ? "text-slate-600" : "text-white"
                    }`}
                  >
                    {savedRecipeId ? "Saved" : "Save Recipe"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleLogRecipeAsMeal}
              activeOpacity={0.9}
              className="mt-3 flex-row items-center justify-center rounded-full bg-emerald-600 px-4 py-3.5"
            >
              <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
              <Text className="ml-2 text-sm font-bold text-white">
                Log as Meal
              </Text>
            </TouchableOpacity>

            <Text className="mt-3 text-xs leading-5 text-slate-500">
              We will prefill the meal log with this recipe&apos;s estimated calories and macros so you can review before saving.
            </Text>
          </View>
        )}

        <View className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-emerald-700">
                Saved Recipes
              </Text>
              <Text className="mt-2 text-lg font-black text-slate-900">
                Your cookbook
              </Text>
            </View>

            <View className="rounded-full bg-white px-3 py-2">
              <Text className="text-xs font-semibold text-slate-700">
                {savedRecipes.length} saved
              </Text>
            </View>
          </View>

          {savedRecipes.length === 0 ? (
            <View className="mt-4 rounded-[18px] border border-dashed border-slate-300 bg-white px-4 py-4">
              <Text className="text-sm leading-6 text-slate-500">
                Save generated recipes to build a quick personal recipe collection here.
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 16, paddingRight: 8 }}
            >
              {savedRecipes.map((saved) => (
                <TouchableOpacity
                  key={saved.id}
                  onPress={() => handleOpenRecipe(saved.id)}
                  activeOpacity={0.85}
                  className="mr-3 w-[220px] rounded-[22px] border border-emerald-100 bg-white p-4"
                >
                  <Text className="text-[11px] font-semibold uppercase tracking-[1.2px] text-emerald-700">
                    {saved.mealType}
                  </Text>
                  <Text className="mt-2 text-base font-black text-slate-900">
                    {saved.title}
                  </Text>
                  <Text
                    numberOfLines={2}
                    className="mt-2 text-sm leading-6 text-slate-500"
                  >
                    {saved.summary}
                  </Text>

                  <View className="mt-4 flex-row flex-wrap">
                    <View className="mr-2 mb-2 rounded-full bg-slate-100 px-3 py-2">
                      <Text className="text-xs font-semibold text-slate-700">
                        {saved.estimatedNutrition.calories} cal
                      </Text>
                    </View>
                    <View className="mb-2 rounded-full bg-slate-100 px-3 py-2">
                      <Text className="text-xs font-semibold text-slate-700">
                        {saved.servings} servings
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
}
