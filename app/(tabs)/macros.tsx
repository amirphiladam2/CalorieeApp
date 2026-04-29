import MacroDetailsCard from '@/components/Macros/MacroDetailCard'
import MacrosByRange from '@/components/Macros/macrosByRange'
import MacroSummaryCard from '@/components/Macros/MacroSummaryCard'
import { DEFAULT_CALORIE_GOAL } from "@/constants/profileDefaults"
import { useProfile } from '@/hooks/useProfile'
import { makeSelectMacrosByRange } from "@/store/selectors/mealsSelectors"
import { getLocalDateString, getRangeForFilter } from "@/utils/DateRangeHelper"
import {
    getInclusiveDayCount,
    getMacroCalorieBreakdown,
    getMacroTargets,
} from "@/utils/macroTargets"
import Ionicons from "@expo/vector-icons/Ionicons"
import React, { useMemo, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

const formatDateLabel = (date: string) => {
  const today = getLocalDateString();
  if (date === today) return "Today";

  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
};

export default function Macros() {
  const [activeFilter, setActiveFilter] = useState<"Today" | "Week" | "Month">("Today");
  const { profile } = useProfile();

  const [selectedDate, setSelectedDate] = useState(getLocalDateString());

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const macrosSelector = useMemo(
    () => makeSelectMacrosByRange(activeFilter, selectedDate),
    [activeFilter, selectedDate]
  );


  const { calories, protein, carbs, fats } = useSelector(macrosSelector);
  const calorieGoal = profile?.calorie_goal ?? DEFAULT_CALORIE_GOAL;
  const activeRange = useMemo(
    () => getRangeForFilter(activeFilter, selectedDate),
    [activeFilter, selectedDate]
  );
  const targetDays = useMemo(
    () => getInclusiveDayCount(activeRange.start, activeRange.end),
    [activeRange.end, activeRange.start]
  );
  const macroTargets = useMemo(
    () => getMacroTargets(
      calorieGoal, 
      targetDays,
      profile?.protein_goal,
      profile?.carbs_goal,
      profile?.fats_goal
    ),
    [calorieGoal, targetDays, profile]
  );
  const macroCalorieBreakdown = useMemo(
    () => getMacroCalorieBreakdown(protein, carbs, fats),
    [protein, carbs, fats]
  );
  const safeMacroCalories = macroCalorieBreakdown.totalMacroCalories || 1;

  const summarySegments = [
    {
      label: "Protein",
      detail: `${protein}g / ${macroTargets.protein}g`,
      percent: Math.round((macroCalorieBreakdown.proteinCalories / safeMacroCalories) * 100),
      color: "#3B82F6",
    },
    {
      label: "Carbs",
      detail: `${carbs}g / ${macroTargets.carbs}g`,
      percent: Math.round((macroCalorieBreakdown.carbsCalories / safeMacroCalories) * 100),
      color: "#F59E0B",
    },
    {
      label: "Fats",
      detail: `${fats}g / ${macroTargets.fats}g`,
      percent: Math.round((macroCalorieBreakdown.fatsCalories / safeMacroCalories) * 100),
      color: "#EC4899",
    },
  ];
  const breakdownTitle =
    activeFilter === "Today" ? "Daily Breakdown" : `${activeFilter} Breakdown`;

  return (
    <SafeAreaView className='flex-1 bg-[#F4F8F5]'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      > 
        <View className='px-4 pt-2'>
          <Text className='text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-700'>
            Nutrition Insights
          </Text>
          <Text className='mt-1 text-[28px] font-black text-slate-900'>Macros</Text>
          <Text className='mt-2 text-sm leading-6 text-slate-500'>
            Monitor protein, carbs, fats, and calories with the same daily dashboard feel.
          </Text>
        </View>

        <View className="mb-4 mt-4 flex-row items-center justify-between px-4">
          <Text className="text-[16px] font-semibold text-slate-700">
            {formatDateLabel(selectedDate)}
          </Text>
          <TouchableOpacity onPress={() => setDatePickerVisible(true)}
            className='h-11 w-11 items-center justify-center rounded-full border border-emerald-100 bg-white'
            >
            <Ionicons
              name="calendar-outline"
              size={22}
              color="#11be62ff"
            />
          </TouchableOpacity>
        </View>
        <View className='px-4'>
          <MacrosByRange
          activeFilter={activeFilter}
          onChange={setActiveFilter}
        />
        </View>
        
        <View className='px-4 pb-2 pt-1'>
          <Text className='text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-700'>
            Breakdown
          </Text>
          <Text className='mt-1 text-[22px] font-black text-slate-900'>Macro Details</Text>
        </View>

      
        <View className='px-4'>
          <MacroSummaryCard
          title={breakdownTitle}
          current={calories}
          goal={macroTargets.calories}
          segments={summarySegments}
        />
          <MacroDetailsCard
            label="Protein"
            color="#3B82F6"
            current={protein}
            goal={macroTargets.protein}
          />
          <MacroDetailsCard
            label="Carbohydrates"
            color="#f6b53bff"
            current={carbs}
            goal={macroTargets.carbs}
          />
          <MacroDetailsCard
            label="Fats"
            color="#f63b6dff"
            current={fats}
            goal={macroTargets.fats}
          />
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
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}



