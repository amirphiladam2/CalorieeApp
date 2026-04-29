import { Text, View, TouchableOpacity } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type AddButton = {
  onPress: () => void;
};

export default function AddMealsButton({ onPress }: AddButton) {
  return (
    <View className="px-4">
      <TouchableOpacity
        className="w-full rounded-[24px] bg-emerald-600 px-5 py-4 shadow-sm"
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <MaterialIcons name="add" size={24} color="white" />
            </View>

            <View>
              <Text className="text-[16px] font-bold text-white">
                Add New Meal
              </Text>
              <Text className="mt-1 text-sm text-emerald-50/85">
                Log calories, macros, and meal time
              </Text>
            </View>
          </View>

          <MaterialIcons name="arrow-forward" size={22} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
}
