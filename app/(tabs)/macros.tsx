import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MacrosByRange from '@/components/Macros/macrosByRange'
import MacroDetailsCard from '@/components/Macros/MacroDetailCard'
import MacroSummaryCard from '@/components/Macros/MacroSummaryCard'
import { useSelector } from 'react-redux'
import { makeSelectMacrosByRange } from "@/store/selectors/mealsSelectors";
import { getLocalDateString } from "@/utils/DateRangeHelper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

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

  const [selectedDate, setSelectedDate] = useState(getLocalDateString());

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const macrosSelector = useMemo(
    () => makeSelectMacrosByRange(activeFilter, selectedDate),
    [activeFilter, selectedDate]
  );


  const { calories, protein, carbs, fats } = useSelector(macrosSelector);

  const summarySegments = [
    { label: "Protein", value: protein, color: "#3B82F6" },
    { label: "Carbs", value: carbs, color: "#F59E0B" },
    { label: "Fats", value: fats, color: "#EC4899" },
  ];

  return (
    <SafeAreaView className='flex-1'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      > 
        <View className='p-4'>
          <Text className='text-[20px] font-bold text-gray-700'>Macros Tracking</Text>
          <Text className='text-[14px] text-gray-600'>Monitor your macro nutrients</Text>
        </View>
        <View className="flex-row items-center justify-between px-4  mt-2 mb-4">
          <Text className="text-[16px] font-medium text-gray-700">
            {formatDateLabel(selectedDate)}
          </Text>
          <TouchableOpacity onPress={() => setDatePickerVisible(true)}
            className='px-4'
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
        
        <View className='p-2'>
          <Text className='text-[18px] font-semibold text-gray-600 ml-2'>Macro Details</Text>
        </View>

      
        <View className='px-4'>
          <MacroSummaryCard
          title="Daily Breakdown"
          current={calories}
          goal={2000}
          segments={summarySegments}
        />
          <MacroDetailsCard
            label="Protein"
            color="#3B82F6"
            current={protein}
            goal={150}
          />
          <MacroDetailsCard
            label="Carbohydrates"
            color="#f6b53bff"
            current={carbs}
            goal={100}
          />
          <MacroDetailsCard
            label="Fats"
            color="#f63b6dff"
            current={fats}
            goal={100}
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



