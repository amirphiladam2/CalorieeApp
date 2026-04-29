import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type MealDatePickerProps = {
  date: string;
  onPickDate: () => void;
  onSetToday: () => void;
  onSetTomorrow: () => void;
};

const MealDatePicker = ({
  date,
  onPickDate,
  onSetToday,
  onSetTomorrow,
}: MealDatePickerProps) => {
  const formatQuickDate = (targetDate: Date) =>
    targetDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  return (
    <View className="rounded-[22px] border border-emerald-100 bg-emerald-50 p-4">
      <Text className="text-[12px] font-semibold uppercase tracking-[1.2px] text-emerald-700">
        Meal Date
      </Text>
      <Text className="mt-1 text-sm leading-6 text-slate-500">
        Choose when this meal should appear in your log.
      </Text>

      <TouchableOpacity
        onPress={onPickDate}
        activeOpacity={0.85}
        className="mt-4 flex-row items-center justify-between rounded-[18px] border border-emerald-100 bg-white px-4 py-4"
      >
        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
            <Ionicons name="calendar-outline" size={20} color="#0F9F67" />
          </View>
          <View>
            <Text className="text-xs font-semibold uppercase tracking-[1px] text-slate-500">
              Selected Date
            </Text>
            <Text className="mt-1 text-base font-bold text-slate-900">
              {date}
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
      </TouchableOpacity>

      <View className="mt-4 flex-row">
        <TouchableOpacity
          onPress={onSetToday}
          activeOpacity={0.85}
          className="mr-3 flex-1 rounded-full bg-emerald-600 px-4 py-3"
        >
          <Text className="text-center text-sm font-semibold text-white">
            Today · {formatQuickDate(today)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSetTomorrow}
          activeOpacity={0.85}
          className="flex-1 rounded-full border border-emerald-100 bg-white px-4 py-3"
        >
          <Text className="text-center text-sm font-semibold text-emerald-700">
            Tomorrow · {formatQuickDate(tomorrow)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MealDatePicker;
