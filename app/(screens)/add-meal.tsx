import { CustomButton } from "@/components/Buttons/CustomButton";
import MealDatePicker from "@/components/Meals/MealDatePicker";
import { mealCategories } from "@/data/mealCategories";
import type { MealType } from "@/data/todayMeals";
import { useAuth } from "@/hooks/useAuth";
import type { AppDispatch } from "@/store";
import { createMeal, updateMeal } from "@/store/mealsThunks";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getTomorrowDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getParamString = (
  value: string | string[] | undefined,
  fallback = ""
) => (typeof value === "string" ? value : fallback);

const isMealType = (value: string): value is MealType =>
  mealCategories.some((category) => category.type === value);

export default function AddMeal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const isEdit = Boolean(getParamString(params.id));
  const initialMealType = getParamString(params.meal, "Breakfast");
  const recipeTitle = getParamString(params.recipeTitle);
  const recipeSummary = getParamString(params.recipeSummary);
  const recipeServings = getParamString(params.recipeServings);
  const recipeSourcePrompt = getParamString(params.recipeSourcePrompt);
  const hasRecipeContext = recipeSourcePrompt.length > 0 || Boolean(recipeServings);

  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [mealType, setMealType] = useState<MealType>(
    isMealType(initialMealType) ? initialMealType : "Breakfast"
  );
  const [calories, setCalories] = useState(getParamString(params.calories));
  const [time, setTime] = useState(getParamString(params.time, "08:00"));
  const [protein, setProtein] = useState(getParamString(params.protein));
  const [carbs, setCarbs] = useState(getParamString(params.carbs));
  const [fats, setFats] = useState(getParamString(params.fats));
  const [title, setTitle] = useState(getParamString(params.recipeTitle));
  const [description, setDescription] = useState(getParamString(params.recipeSummary));

  const handleSave = () => {
    const parsedCalories = Number(calories);
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!user) {
      Alert.alert("Not signed in", "Please sign in again before saving meals.");
      return;
    }

    if (!calories || Number.isNaN(parsedCalories) || parsedCalories <= 0) {
      Alert.alert("Invalid calories", "Enter a valid calorie amount greater than zero.");
      return;
    }

    if (!timePattern.test(time.trim())) {
      Alert.alert("Invalid time", "Use 24-hour time like 08:00 or 18:30.");
      return;
    }

    if (isEdit) {
      dispatch(
        updateMeal(getParamString(params.id), {
          meal: mealType,
          calories: parsedCalories,
          time: time.trim(),
          protein: protein ? Number(protein) : undefined,
          carbs: carbs ? Number(carbs) : undefined,
          fats: fats ? Number(fats) : undefined,
          recipe_title: title.trim() || null,
          recipe_summary: description.trim() || null,
        })
      );
    } else {
      dispatch(
        createMeal(user.id, mealType, parsedCalories, time.trim(), selectedDate, {
          protein: protein ? Number(protein) : undefined,
          carbs: carbs ? Number(carbs) : undefined,
          fats: fats ? Number(fats) : undefined,
        }, {
          recipe_title: title.trim() || null,
          recipe_summary: description.trim() || null,
          recipe_source_prompt: recipeSourcePrompt || null,
          recipe_servings: recipeServings ? Number(recipeServings) : null,
        })
      );
    }

    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F8F5]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
          automaticallyAdjustKeyboardInsets
          contentInsetAdjustmentBehavior="always"
          contentContainerStyle={{
            paddingBottom: Math.max(insets.bottom + 140, 140),
          }}
        >
          <View className="px-4 pb-2 pt-2">
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.8}
              className="h-11 w-11 items-center justify-center rounded-full border border-emerald-100 bg-white"
            >
              <Ionicons name="chevron-back" size={22} color="#0F172A" />
            </TouchableOpacity>

            <Text className="mt-6 text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-700">
              Nutrition Log
            </Text>
            <Text className="mt-1 text-[28px] font-black text-slate-900">
              {isEdit ? "Edit meal" : "Add a meal"}
            </Text>
            <Text className="mt-2 text-sm leading-6 text-slate-500">
              {isEdit
                ? "Adjust the meal type, calories, time, and macros without losing the entry."
                : "Capture calories, timing, and macros in a cleaner meal entry flow."}
            </Text>

            {hasRecipeContext ? (
              <View className="mt-6 rounded-[28px] border border-emerald-200 bg-emerald-50 p-5">
                <Text className="text-[12px] font-semibold uppercase tracking-[1.4px] text-emerald-700">
                  {isEdit ? "Recipe-linked Meal" : "Recipe Prefill"}
                </Text>
                <Text className="mt-2 text-[20px] font-black text-slate-900">
                  {recipeTitle || "Generated recipe"}
                </Text>
                {recipeSummary ? (
                  <Text className="mt-2 text-sm leading-6 text-slate-600">
                    {recipeSummary}
                  </Text>
                ) : null}

                <View className="mt-4 flex-row flex-wrap">
                  <View className="mr-2 mb-2 rounded-full bg-white px-3 py-2">
                    <Text className="text-xs font-semibold text-slate-700">
                      {mealType}
                    </Text>
                  </View>
                  {recipeServings ? (
                    <View className="mr-2 mb-2 rounded-full bg-white px-3 py-2">
                      <Text className="text-xs font-semibold text-slate-700">
                        {recipeServings} servings
                      </Text>
                    </View>
                  ) : null}
                </View>

                {recipeSourcePrompt ? (
                  <View className="mt-2 rounded-[20px] bg-white px-4 py-3">
                    <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-slate-500">
                      Source Ingredients
                    </Text>
                    <Text className="mt-1 text-sm leading-6 text-slate-700">
                      {recipeSourcePrompt}
                    </Text>
                  </View>
                ) : null}

                <Text className="mt-2 text-xs leading-5 text-emerald-900">
                  {isEdit
                    ? "This meal was originally logged from a recipe. You can adjust the nutrition details without losing the recipe reference."
                    : "Calories and macros were prefilled from the recipe estimate. Review them before saving the meal."}
                </Text>
              </View>
            ) : null}

            <View className="mt-6 rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm">
              <Text className="text-[12px] font-semibold uppercase tracking-[1.4px] text-emerald-700">
                Meal Type
              </Text>
              <Text className="mt-1 text-[22px] font-black text-slate-900">
                Pick a category
              </Text>
              <Text className="mt-2 text-sm leading-6 text-slate-500">
                Choose the meal bucket that best matches this entry.
              </Text>

              <View className="mt-5 flex-row flex-wrap justify-between">
                {mealCategories.map((category) => {
                  const isSelected = mealType === category.type;

                  return (
                    <TouchableOpacity
                      key={category.type}
                      onPress={() => setMealType(category.type)}
                      activeOpacity={0.85}
                      className={`mb-3 rounded-[24px] border p-4 ${
                        category.type === "Shake" ? "w-full" : "w-[48%]"
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? category.activeBgColor
                          : "#FFFFFF",
                        borderColor: isSelected
                          ? category.activeBgColor
                          : category.bgColor,
                      }}
                    >
                      <View
                        className="h-11 w-11 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: isSelected
                            ? "rgba(255,255,255,0.18)"
                            : category.bgColor,
                        }}
                      >
                        <Ionicons
                          name={category.icon}
                          size={20}
                          color={
                            isSelected
                              ? category.activeTextColor
                              : category.textColor
                          }
                        />
                      </View>

                      <Text
                        className="mt-4 text-base font-bold"
                        style={{
                          color: isSelected
                            ? category.activeTextColor
                            : "#0F172A",
                        }}
                      >
                        {category.label}
                      </Text>
                      <Text
                        className="mt-1 text-xs leading-5"
                        style={{
                          color: isSelected
                            ? "rgba(255,255,255,0.86)"
                            : "#64748B",
                        }}
                      >
                        {category.type === "Breakfast"
                          ? "Start your day strong"
                          : category.type === "Lunch"
                            ? "Midday fuel"
                            : category.type === "Snacks"
                              ? "Quick bite or treat"
                              : category.type === "Dinner"
                                ? "Evening meal"
                                : "Smoothies and shakes"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View className="mt-4 rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm">
              <Text className="text-[12px] font-semibold uppercase tracking-[1.4px] text-emerald-700">
                Details
              </Text>
              <Text className="mt-1 text-[22px] font-black text-slate-900">
                Title & Description
              </Text>
              <Text className="mt-2 text-sm leading-6 text-slate-500">
                Give your meal a name and description (optional)
              </Text>

              <View className="mt-5">
                <Text className="text-sm font-semibold text-slate-700">
                  Meal Title
                </Text>
                <View className="mt-2 flex-row items-center rounded-[20px] border border-slate-200 bg-slate-50 px-4">
                  <Ionicons name="card-outline" size={20} color="#64748B" />
                  <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="e.g. Avocado Toast"
                    placeholderTextColor="#94A3B8"
                    autoCorrect={false}
                    className="ml-3 flex-1 py-4 text-base font-semibold text-slate-900"
                  />
                </View>
              </View>

              <View className="mt-4">
                <Text className="text-sm font-semibold text-slate-700">
                  Description
                </Text>
                <View className="mt-2 flex-row items-start rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-1">
                  <View className="mt-3">
                    <Ionicons name="document-text-outline" size={20} color="#64748B" />
                  </View>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="e.g. 2 slices of sourdough with avocado"
                    placeholderTextColor="#94A3B8"
                    autoCorrect={true}
                    multiline
                    textAlignVertical="top"
                    className="ml-3 flex-1 min-h-[80px] py-3 text-base text-slate-900"
                  />
                </View>
              </View>
            </View>

            <View className="mt-4 rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm">
              <Text className="text-[12px] font-semibold uppercase tracking-[1.4px] text-emerald-700">
                Values
              </Text>
              <Text className="mt-1 text-[22px] font-black text-slate-900">
                Calories and timing
              </Text>

              <View className="mt-5">
                <Text className="text-sm font-semibold text-slate-700">
                  Calories
                </Text>
                <View className="mt-2 flex-row items-center rounded-[20px] border border-slate-200 bg-slate-50 px-4">
                  <Ionicons name="flame-outline" size={20} color="#F97316" />
                  <TextInput
                    value={calories}
                    onChangeText={setCalories}
                    placeholder="Enter total calories"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    autoCorrect={false}
                    className="ml-3 flex-1 py-4 text-base font-semibold text-slate-900"
                  />
                  <Text className="text-sm font-semibold text-slate-400">
                    kcal
                  </Text>
                </View>
              </View>

              <View className="mt-4">
                <Text className="text-sm font-semibold text-slate-700">
                  Time
                </Text>
                <View className="mt-2 flex-row items-center rounded-[20px] border border-slate-200 bg-slate-50 px-4">
                  <Ionicons name="time-outline" size={20} color="#0F9F67" />
                  <TextInput
                    value={time}
                    onChangeText={setTime}
                    placeholder="08:00"
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="ml-3 flex-1 py-4 text-base font-semibold text-slate-900"
                  />
                </View>
              </View>

              {isEdit ? (
                <View className="mt-4 rounded-[22px] bg-emerald-50 px-4 py-4">
                  <Text className="text-[12px] font-semibold uppercase tracking-[1.2px] text-emerald-700">
                    Editing
                  </Text>
                  <Text className="mt-2 text-sm leading-6 text-emerald-900">
                    Existing meals keep their original log date. Use this screen
                    to update the details and macro breakdown.
                  </Text>
                </View>
              ) : (
                <View className="mt-4">
                  <MealDatePicker
                    date={selectedDate}
                    onPickDate={() => setDatePickerVisible(true)}
                    onSetToday={() => setSelectedDate(getLocalDateString())}
                    onSetTomorrow={() =>
                      setSelectedDate(getTomorrowDateString())
                    }
                  />
                </View>
              )}
            </View>

            <View className="mt-4 rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm">
              <Text className="text-[12px] font-semibold uppercase tracking-[1.4px] text-emerald-700">
                Macros
              </Text>
              <Text className="mt-1 text-[22px] font-black text-slate-900">
                Optional breakdown
              </Text>
              <Text className="mt-2 text-sm leading-6 text-slate-500">
                Add macros if you want a better daily protein, carbs, and fat
                summary.
              </Text>

              <View className="mt-5 flex-row">
                <View className="mr-3 flex-1">
                  <Text className="text-[12px] font-semibold uppercase tracking-[1px] text-blue-600">
                    Protein
                  </Text>
                  <TextInput
                    placeholder="0"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    value={protein}
                    onChangeText={setProtein}
                    autoCorrect={false}
                    className="mt-2 rounded-[18px] border border-slate-200 bg-slate-50 px-3 py-4 text-center text-base font-semibold text-slate-900"
                  />
                </View>

                <View className="mr-3 flex-1">
                  <Text className="text-[12px] font-semibold uppercase tracking-[1px] text-amber-600">
                    Carbs
                  </Text>
                  <TextInput
                    placeholder="0"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    value={carbs}
                    onChangeText={setCarbs}
                    autoCorrect={false}
                    className="mt-2 rounded-[18px] border border-slate-200 bg-slate-50 px-3 py-4 text-center text-base font-semibold text-slate-900"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-[12px] font-semibold uppercase tracking-[1px] text-pink-600">
                    Fats
                  </Text>
                  <TextInput
                    placeholder="0"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    value={fats}
                    onChangeText={setFats}
                    autoCorrect={false}
                    className="mt-2 rounded-[18px] border border-slate-200 bg-slate-50 px-3 py-4 text-center text-base font-semibold text-slate-900"
                  />
                </View>
              </View>
            </View>

            <View className="mt-6">
              <CustomButton
                title={isEdit ? "Update Meal" : "Save Meal"}
                onPress={handleSave}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          const y = date.getFullYear();
          const m = String(date.getMonth() + 1).padStart(2, "0");
          const d = String(date.getDate()).padStart(2, "0");

          setSelectedDate(`${y}-${m}-${d}`);
          setDatePickerVisible(false);
        }}
        onCancel={() => setDatePickerVisible(false)}
      />
    </SafeAreaView>
  );
}
