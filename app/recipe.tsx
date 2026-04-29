import { CustomButton } from "@/components/Buttons/CustomButton";
import {
    deleteRecipe,
    getRecipeForDetail,
    saveDraftRecipe,
    type StoredRecipe,
} from "@/services/recipeBook";
import { buildMealPrefillFromRecipe } from "@/utils/recipeMealPrefill";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const [recipe, setRecipe] = useState<StoredRecipe | null>(null);
  const [source, setSource] = useState<"saved" | "draft" | "missing">(
    "missing"
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadRecipe = useCallback(async () => {
    setLoading(true);

    const nextId = typeof params.id === "string" ? params.id : undefined;
    const detail = await getRecipeForDetail(nextId);

    setRecipe(detail.recipe);
    setSource(detail.source);
    setLoading(false);
  }, [params.id]);

  useFocusEffect(
    useCallback(() => {
      void loadRecipe();
    }, [loadRecipe])
  );

  const handleSaveRecipe = async () => {
    try {
      setSaving(true);
      const savedRecipe = await saveDraftRecipe();

      Alert.alert("Recipe saved", "This recipe is now in your saved recipe list.");
      router.replace({
        pathname: "/recipe",
        params: { id: savedRecipe.id },
      });
    } catch (error) {
      Alert.alert(
        "Unable to save recipe",
        error instanceof Error ? error.message : "Saving failed."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogRecipeAsMeal = () => {
    if (!recipe) {
      return;
    }

    router.push({
      pathname: "/add-meal",
      params: buildMealPrefillFromRecipe(recipe, {
        sourcePrompt: recipe.sourcePrompt,
      }),
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F4F8F5]">
        <ActivityIndicator size="large" color="#0F9F67" />
      </SafeAreaView>
    );
  }

  if (!recipe || source === "missing") {
    return (
      <SafeAreaView className="flex-1 bg-[#F4F8F5]">
        <View className="flex-1 px-6 py-6">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            className="h-11 w-11 items-center justify-center rounded-full border border-emerald-100 bg-white"
          >
            <Ionicons name="chevron-back" size={22} color="#0F172A" />
          </TouchableOpacity>

          <View className="mt-8 rounded-[28px] border border-emerald-100 bg-white p-6 shadow-sm">
            <Text className="text-[22px] font-black text-slate-900">
              Recipe not found
            </Text>
            <Text className="mt-3 text-sm leading-6 text-slate-500">
              Generate a new recipe or open one from your saved recipe list.
            </Text>

            <View className="mt-5">
              <CustomButton
                title="Back to Home"
                onPress={() => router.replace("/(tabs)/home")}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F4F8F5]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-4 pb-2 pt-2">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            className="h-11 w-11 items-center justify-center rounded-full border border-emerald-100 bg-white"
          >
            <Ionicons name="chevron-back" size={22} color="#0F172A" />
          </TouchableOpacity>

          <View className="mt-6 rounded-[30px] bg-[#032E16] p-5 shadow-sm">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-[11px] font-semibold uppercase tracking-[1.5px] text-emerald-100/75">
                  {source === "saved" ? "Saved Recipe" : "Latest Recipe"}
                </Text>
                <Text className="mt-2 text-[28px] font-black text-white">
                  {recipe.title}
                </Text>
                <Text className="mt-3 text-sm leading-6 text-emerald-50/80">
                  {recipe.summary}
                </Text>
              </View>

              <View className="rounded-[20px] bg-white/10 px-3 py-3">
                <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-emerald-50/70">
                  Type
                </Text>
                <Text className="mt-2 text-sm font-bold text-white">
                  {recipe.mealType}
                </Text>
              </View>
            </View>

            <View className="mt-4 flex-row flex-wrap">
              <View className="mr-2 mb-2 rounded-full border border-white/10 bg-white/10 px-3 py-2">
                <Text className="text-xs font-semibold text-white">
                  {recipe.servings} servings
                </Text>
              </View>
              <View className="mr-2 mb-2 rounded-full border border-white/10 bg-white/10 px-3 py-2">
                <Text className="text-xs font-semibold text-white">
                  Prep {recipe.prepTimeMinutes} min
                </Text>
              </View>
              <View className="mb-2 rounded-full border border-white/10 bg-white/10 px-3 py-2">
                <Text className="text-xs font-semibold text-white">
                  Cook {recipe.cookTimeMinutes} min
                </Text>
              </View>
            </View>

            <View className="mt-4 rounded-[22px] bg-white/10 px-4 py-4">
              <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-emerald-50/70">
                Source Ingredients
              </Text>
              <Text className="mt-2 text-sm leading-6 text-white">
                {recipe.sourcePrompt}
              </Text>
            </View>
          </View>

          <View className="mt-4 rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm">
            <Text className="text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-700">
              Nutrition
            </Text>
            <View className="mt-4 flex-row flex-wrap justify-between">
              <View className="mb-3 w-[48.5%] rounded-[20px] bg-slate-50 px-4 py-4">
                <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-slate-500">
                  Calories
                </Text>
                <Text className="mt-2 text-[22px] font-black text-slate-900">
                  {recipe.estimatedNutrition.calories}
                </Text>
              </View>
              <View className="mb-3 w-[48.5%] rounded-[20px] bg-slate-50 px-4 py-4">
                <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-slate-500">
                  Protein
                </Text>
                <Text className="mt-2 text-[22px] font-black text-slate-900">
                  {recipe.estimatedNutrition.proteinGrams}g
                </Text>
              </View>
              <View className="w-[48.5%] rounded-[20px] bg-slate-50 px-4 py-4">
                <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-slate-500">
                  Carbs
                </Text>
                <Text className="mt-2 text-[22px] font-black text-slate-900">
                  {recipe.estimatedNutrition.carbsGrams}g
                </Text>
              </View>
              <View className="w-[48.5%] rounded-[20px] bg-slate-50 px-4 py-4">
                <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-slate-500">
                  Fat
                </Text>
                <Text className="mt-2 text-[22px] font-black text-slate-900">
                  {recipe.estimatedNutrition.fatGrams}g
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-4 rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm">
            <Text className="text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-700">
              Ingredients
            </Text>
            <View className="mt-4">
              {recipe.ingredients.map((ingredient, index) => (
                <View
                  key={`${ingredient.name}-${index}`}
                  className="mb-3 rounded-[20px] bg-slate-50 px-4 py-4"
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

          <View className="mt-4 rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm">
            <Text className="text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-700">
              Steps
            </Text>
            <View className="mt-4">
              {recipe.steps.map((step, index) => (
                <View
                  key={`${index + 1}-${step}`}
                  className="mb-3 flex-row rounded-[22px] bg-slate-50 px-4 py-4"
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

          {recipe.tips.length > 0 ? (
            <View className="mt-4 rounded-[28px] border border-amber-200 bg-amber-50 p-5">
              <Text className="text-[12px] font-semibold uppercase tracking-[1.5px] text-amber-700">
                Tips
              </Text>
              <View className="mt-4">
                {recipe.tips.map((tip, index) => (
                  <View key={`${index + 1}-${tip}`} className="mb-3 flex-row">
                    <View className="mr-3 mt-2 h-2 w-2 rounded-full bg-amber-500" />
                    <Text className="flex-1 text-sm leading-6 text-amber-900">
                      {tip}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          <View className="mt-6">
            <TouchableOpacity
              onPress={handleLogRecipeAsMeal}
              activeOpacity={0.85}
              className="items-center justify-center rounded-full bg-emerald-600 px-4 py-3.5"
            >
              <Text className="text-base font-bold text-white">
                Log as Meal
              </Text>
            </TouchableOpacity>
            <Text className="mt-3 text-xs leading-5 text-slate-500">
              The meal form will open with this recipe&apos;s estimated calories and macros so you can adjust the entry before saving.
            </Text>
          </View>

          {source === "draft" ? (
            <View className="mt-4">
              <CustomButton
                title="Save Recipe"
                onPress={handleSaveRecipe}
                loading={saving}
                loadingText="Saving..."
              />
            </View>
          ) : source === "saved" ? (
             <View className="mt-4">
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Delete Recipe",
                    "Are you sure you want to delete this recipe?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: async () => {
                          try {
                            setSaving(true);
                            await deleteRecipe(recipe.id);
                            Alert.alert("Deleted", "Your recipe has been deleted.");
                            router.back();
                          } catch (error) {
                            Alert.alert("Error", "Could not delete recipe.");
                          } finally {
                            setSaving(false);
                          }
                        }
                      }
                    ]
                  );
                }}
                disabled={saving}
                className="flex-row items-center justify-center rounded-[20px] bg-red-50 p-4 border border-red-100"
              >
                <Ionicons name="trash-outline" size={20} color="#DC2626" />
                <Text className="ml-2 font-bold text-red-600">Delete Recipe</Text>
              </TouchableOpacity>
             </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
