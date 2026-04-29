import CircularProgress from "@/components/HomeScreen/CircularProgress";
import { getMacroTargets } from "@/utils/macroTargets";
import Ionicons from "@expo/vector-icons/Ionicons";
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
  proteinGoal?: number | null;
  carbsGoal?: number | null;
  fatsGoal?: number | null;
};


export default function DailyCaloriesCard({
  consumed,
  goal,
  protein,
  carbs,
  fats,
  proteinGoal,
  carbsGoal,
  fatsGoal,
}: DailyCaloriesProps) {
  const now = new Date();
  const formattedDate = format(now, "MMM dd, yyyy");
  const remainingCalories = Math.max(goal - consumed, 0);
  const overCalories = Math.max(consumed - goal, 0);
  const macroTargets = getMacroTargets(goal, 1, proteinGoal, carbsGoal, fatsGoal);

  const percentage = Math.min(
    100,
    Math.round((consumed / goal) * 100)
  );

  return (
    <View className="w-full self-center rounded-[28px] bg-white p-5 shadow-md">
      <View className="flex-row justify-between mb-4">
        <View>
          <Text className="text-[13px] font-semibold uppercase tracking-wide text-emerald-700">
            Today&apos;s Goal
          </Text>
          <Text className="mt-1 text-[13px] text-gray-500">{formattedDate}</Text>
        </View>

        <View className={`flex-row items-center rounded-[18px] border px-3 py-2 ${overCalories > 0 ? 'border-amber-200 bg-amber-50' : 'border-emerald-100 bg-emerald-50'}`}>
          <View className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-white">
            <Ionicons name={overCalories > 0 ? "warning-outline" : "flash-outline"} size={16} color={overCalories > 0 ? "#D97706" : "#0F9F67"} />
          </View>
          <View>
            <Text className={`text-[10px] font-semibold uppercase tracking-[1px] ${overCalories > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
              {overCalories > 0 ? "Over Goal" : "Remaining"}
            </Text>
            <Text className={`text-sm font-bold ${overCalories > 0 ? 'text-amber-900' : 'text-emerald-900'}`}>
              {overCalories > 0 ? overCalories : remainingCalories} cal
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center gap-4">
        <View className="flex-1 pr-2">
          <Text className="text-2xl font-bold text-gray-900">
            Calories today
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {consumed} of {goal} calories
          </Text>
        </View>

        <CircularProgress
          progress={percentage}
          size={96}
          label="Daily goal"
        />
      </View>

      <View className="mt-6 h-px bg-slate-100" />

      <View className="mt-5 flex-row gap-3">
        <MacroProgress
          label="Protein"
          value={`${protein}g / ${macroTargets.protein}g`}
          progress={macroTargets.protein > 0 ? Math.round((protein / macroTargets.protein) * 100) : 0}
          color="#22C55E"
        />
        <MacroProgress
          label="Carbs"
          value={`${carbs}g / ${macroTargets.carbs}g`}
          progress={macroTargets.carbs > 0 ? Math.round((carbs / macroTargets.carbs) * 100) : 0}
          color="#3B82F6"
        />
        <MacroProgress
          label="Fats"
          value={`${fats}g / ${macroTargets.fats}g`}
          progress={macroTargets.fats > 0 ? Math.round((fats / macroTargets.fats) * 100) : 0}
          color="#F97316"
        />
      </View>
    </View>
  );
}
