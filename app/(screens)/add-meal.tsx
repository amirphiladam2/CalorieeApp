import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView,
  Platform, TouchableWithoutFeedback, ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { updateMeal } from "@/store/mealsThunks";
import { useLocalSearchParams } from "expo-router";

import { MealType } from "@/data/todayMeals";
import { useAuth } from "@/hooks/useAuth";
import type { AppDispatch } from "@/store";
import { createMeal } from "@/store/mealsThunks";
import { useDispatch } from "react-redux";
import { CustomButton } from "@/components/Buttons/CustomButton";
import MealDatePicker from "@/components/Meals/MealDatePicker";

const MEAL_TYPES: MealType[] = [
  "Breakfast",
  "Lunch",
  "Snacks",
  "Dinner",
];

const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const Color = {
  iconColor: "#11be62ff"
}
export default function AddMeal() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const getTomorrowDateString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();

  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");

  const params = useLocalSearchParams();
  const isEdit = !!params.id;

  const [mealType, setMealType] = useState<MealType>(
    (params.meal as MealType) || "Breakfast"
  );
  const [calories, setCalories] = useState(
    (params.calories as string) || ""
  );

  const [time, setTime] = useState(
    (params.time as string) || "08:00"
  );


  const handleSave = () => {
    if (!user || !calories) return;

    if (isEdit) {
      dispatch(
        updateMeal(params.id as string, {
          meal: mealType,
          calories: Number(calories),
          time,
          protein: protein ? Number(protein) : undefined,
          carbs: carbs ? Number(carbs) : undefined,
          fats: fats ? Number(fats) : undefined,
        })
      );
    }
    else {
      dispatch(
        createMeal(
          user.id,
          mealType,
          Number(calories),
          time,
          selectedDate,
          {
            protein: protein ? Number(protein) : undefined,
            carbs: carbs ? Number(carbs) : undefined,
            fats: fats ? Number(fats) : undefined,
          }
        )

      );

    }

    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="p-6">
            {/* Header */}
            <View className="mb-8">
              <Text className="text-2xl font-bold text-gray-900">Add Meal</Text>
              <Text className="text-gray-500 mt-1">Track your nutrition</Text>
            </View>

            {/* Meal Type */}
            <Text className="text-sm font-medium text-gray-700 mb-3">
              Meal Type
            </Text>
            <View className="flex-row gap-2 mb-6 self-center">
              {MEAL_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setMealType(type)}
                  className={`px-4 py-2.5 rounded-xl ${mealType === type
                    ? "bg-emerald-500"
                    : "bg-white border border-gray-200"
                    }`}
                >
                  <Text
                    className={`font-medium ${mealType === type ? "text-white" : "text-gray-700"
                      }`}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}

            </View>

            {/* Calories */}
            <Text className="text-sm font-medium text-gray-700 mb-3">
              Calories
            </Text>
            <TextInput
              value={calories}
              onChangeText={setCalories}
              placeholder="Enter amount of calories e.g. 250"
              keyboardType="numeric"
              className="bg-white border border-gray-200 rounded-[15px] px-4 py-3.5 mb-6 text-gray-900"
            />

            {/* Time */}
            <Text className="text-sm font-medium text-gray-700 mb-3">Time</Text>
            <TextInput
              value={time}
              onChangeText={setTime}
              placeholder="08:00"
              className="bg-white border border-gray-200 rounded-[15px]  px-4 py-3.5 mb-8 text-gray-900"
            />
            <MealDatePicker
              date={selectedDate}
              onPickDate={() => setDatePickerVisible(true)}
              onSetToday={() => setSelectedDate(getLocalDateString())}
              onSetTomorrow={() => setSelectedDate(getTomorrowDateString())}
            />

            <Text className="text-sm font-medium text-gray-700 mb-2">
              Macros (optional)
            </Text>

            <View className="flex-row gap-3 mb-6">
              <TextInput
                placeholder="Protein"
                keyboardType="numeric"
                value={protein}
                onChangeText={setProtein}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-3"
              />
              <TextInput
                placeholder="Carbs"
                keyboardType="numeric"
                value={carbs}
                onChangeText={setCarbs}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-3"
              />
              <TextInput
                placeholder="Fats"
                keyboardType="numeric"
                value={fats}
                onChangeText={setFats}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-3"
              />
            </View>
            {/* Save */}
            <CustomButton
              title="Save Meal"
              onPress={handleSave}
            />
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