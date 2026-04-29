import { mealImages } from "@/constants/mealImages";
import { MealType } from "@/data/todayMeals";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type MealsCardProps = {
  meal: MealType;
  calories: number;
  time: string;
  protein?: number;
  carbs?: number;
  fats?: number;
  recipeTitle?: string | null;
  recipeSummary?: string | null;
  recipeServings?: number | null;
  recipeSourcePrompt?: string | null;

  onEdit?: () => void;
  onDelete?: () => void;
};

export default function MealCard({
  meal,
  calories,
  time,
  protein,
  carbs,
  fats,
  recipeTitle,
  recipeSummary,
  recipeServings,
  recipeSourcePrompt,
  onEdit,
  onDelete,
}: MealsCardProps) {
  const hasMacros =
    protein !== undefined || carbs !== undefined || fats !== undefined;
  const hasRecipeContext = Boolean(recipeSourcePrompt) || Boolean(recipeServings);

  return (
    <View className="mt-4 w-full self-center rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <View className="flex-row items-start">
        <View className="h-[76px] w-[76px] rounded-[22px] bg-emerald-50 p-3">
          <Image
            source={mealImages[meal]}
            resizeMode="contain"
            className="w-full h-full"
          />
        </View>

        <View className="ml-4 flex-1">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              {hasRecipeContext ? (
                <View className="mb-2 flex-row items-center self-start rounded-full bg-emerald-50 px-3 py-1.5">
                  <Feather name="book-open" size={12} color="#059669" />
                  <Text className="ml-1.5 text-xs font-semibold uppercase tracking-[1px] text-emerald-700">
                    From recipe
                  </Text>
                </View>
              ) : null}

              <Text className="text-lg font-bold text-slate-900">
                {meal}
              </Text>

              {recipeTitle ? (
                <Text
                  numberOfLines={1}
                  className="mt-1 text-sm font-semibold text-slate-700"
                >
                  {recipeTitle}
                </Text>
              ) : null}

              {recipeSummary ? (
                <Text
                  numberOfLines={2}
                  className="mt-1 text-sm leading-6 text-slate-500"
                >
                  {recipeSummary}
                </Text>
              ) : null}

              <View className="mt-2 flex-row items-center self-start rounded-full bg-slate-100 px-3 py-1.5">
                <Feather name="clock" size={12} color="#64748B" />
                <Text className="ml-1.5 text-sm font-medium text-slate-600">
                  {time}
                </Text>
              </View>

              {recipeServings ? (
                <View className="mt-2 self-start rounded-full bg-slate-100 px-3 py-1.5">
                  <Text className="text-xs font-semibold text-slate-700">
                    {recipeServings} servings
                  </Text>
                </View>
              ) : null}
            </View>

            <View className="rounded-[18px] bg-emerald-50 px-3 py-2">
              <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-emerald-700">
                Calories
              </Text>
              <Text className="mt-1 text-lg font-black text-emerald-800">
                {calories}
              </Text>
            </View>
          </View>

          <View className="mt-4 flex-row flex-wrap">
            {hasMacros ? (
              <>
                <View className="mr-2 mb-2 rounded-full bg-slate-100 px-3 py-1.5">
                  <Text className="text-xs font-semibold text-slate-700">
                    Protein {protein ?? 0}g
                  </Text>
                </View>
                <View className="mr-2 mb-2 rounded-full bg-slate-100 px-3 py-1.5">
                  <Text className="text-xs font-semibold text-slate-700">
                    Carbs {carbs ?? 0}g
                  </Text>
                </View>
                <View className="mb-2 rounded-full bg-slate-100 px-3 py-1.5">
                  <Text className="text-xs font-semibold text-slate-700">
                    Fat {fats ?? 0}g
                  </Text>
                </View>
              </>
            ) : (
              <Text className="text-sm text-slate-500">
                Macros not added for this meal yet.
              </Text>
            )}
          </View>
        </View>
      </View>

      {(onEdit || onDelete) && (
        <View className="mt-4 flex-row justify-end">
          {onEdit && (
            <TouchableOpacity
              onPress={onEdit}
              activeOpacity={0.8}
              className="mr-2 flex-row items-center rounded-full bg-emerald-50 px-4 py-2.5"
            >
              <Feather name="edit-2" size={16} color="#059669" />
              <Text className="ml-2 text-sm font-semibold text-emerald-700">
                Edit
              </Text>
            </TouchableOpacity>
          )}

          {onDelete && (
            <TouchableOpacity
              onPress={onDelete}
              activeOpacity={0.8}
              className="flex-row items-center rounded-full bg-red-50 px-4 py-2.5"
            >
              <Feather name="trash-2" size={16} color="#DC2626" />
              <Text className="ml-2 text-sm font-semibold text-red-600">
                Delete
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
