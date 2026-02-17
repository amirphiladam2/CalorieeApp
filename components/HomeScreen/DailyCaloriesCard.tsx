import CircularProgress from "@/components/HomeScreen/CircularProgress";
import { format } from "date-fns";
import React from "react";
import { Text, View } from "react-native";
import MacroProgress from "./MacroProgress";

type DailyCaloriesProps = {
  consumed: number;
  goal: number;
  protein: number;
  carbs: number;
  fats: number;

};


export default function DailyCaloriesCard({ consumed, goal }: DailyCaloriesProps) {
  const now = new Date();
  const formattedDate = format(now, "MMM dd, yyyy");

  const percentage = Math.min(
    100,
    Math.round((consumed / goal) * 100)
  );

  return (
    <View className="h-[250px] w-full bg-white self-center rounded-2xl p-5 shadow-md">
      {/* Header */}
      <View className="flex-row justify-between mb-4">
        <Text className="text-[14px] text-gray-500">Today's Goal</Text>
        <Text className="text-[14px] text-gray-500">{formattedDate}</Text>
      </View>

      {/* Main Row */}
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-gray-900">
            Daily Calories
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {consumed}/ {goal} cal
          </Text>
        </View>

        <CircularProgress
          progress={percentage}
          label="Daily Goal"
        />
      </View>
      <View className="flex-row gap-4 mt-6">
        <MacroProgress
          label="Protein"
          value="120g"
          progress={60}
          color="#22C55E"
        />
        <MacroProgress
          label="Carbs"
          value="180g"
          progress={45}
          color="#3B82F6"
        />
        <MacroProgress
          label="Fat"
          value={"70g"}
          progress={35}
          color="#F97316"
        />
      </View>
    </View>
  );
}
