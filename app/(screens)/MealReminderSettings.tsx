import { CustomButton } from "@/components/Buttons/CustomButton";
import {
    DEFAULT_MEAL_REMINDERS,
    getCustomMealReminders,
    setCustomMealReminders,
} from "@/services/notifications";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";

type MealReminderType = {
  mealType: string;
  hour: number;
  minute: number;
  title: string;
  body: string;
};

export default function MealReminderSettings() {
  const router = useRouter();
  const [reminders, setReminders] = useState<MealReminderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const customReminders = await getCustomMealReminders();
      setReminders(customReminders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setCustomMealReminders(reminders as any);
      Alert.alert("Success", "Meal reminder timings saved successfully!");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Could not save your preferences right now.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setReminders(DEFAULT_MEAL_REMINDERS);
  };

  const formatTime = (hour: number, minute: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const displayMinute = minute.toString().padStart(2, "0");
    return `${displayHour}:${displayMinute} ${period}`;
  };

  const onConfirmTime = (date: Date) => {
    if (editingIndex !== null) {
      const newReminders = [...reminders];
      newReminders[editingIndex].hour = date.getHours();
      newReminders[editingIndex].minute = date.getMinutes();
      setReminders(newReminders);
    }
    setPickerVisible(false);
    setEditingIndex(null);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F4F8F5]">
        <Text className="text-slate-500">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F4F8F5]">
      <View className="flex-row items-center border-b border-emerald-100 bg-white px-4 pb-4 pt-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-slate-50"
        >
          <Ionicons name="arrow-back" size={20} color="#334155" />
        </TouchableOpacity>
        <Text className="ml-4 text-[20px] font-black text-slate-900">
          Reminder Settings
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-6 pb-24">
        <Text className="text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-700">
          Timing Configuration
        </Text>
        <Text className="mt-1 text-[22px] font-black text-slate-900">
          Custom Meal Times
        </Text>
        <Text className="mt-2 mb-6 text-sm text-slate-500">
          Tap on any meal to adjust when you receive its reminder notification.
        </Text>

        <View className="overflow-hidden rounded-[24px] border border-emerald-100 bg-white shadow-sm">
          {reminders.map((reminder, index) => (
            <View key={reminder.mealType}>
              {index > 0 && <View className="mx-4 h-px bg-slate-100" />}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setEditingIndex(index);
                  setPickerVisible(true);
                }}
                className="flex-row items-center justify-between px-5 py-4"
              >
                <View className="flex-row items-center">
                  <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                    <Ionicons name="time-outline" size={20} color="#0F9F67" />
                  </View>
                  <View>
                    <Text className="text-[16px] font-bold text-slate-900">
                      {reminder.mealType}
                    </Text>
                    <Text className="mt-1 text-[13px] text-slate-500">
                      Current: {formatTime(reminder.hour, reminder.minute)}
                    </Text>
                  </View>
                </View>
                <Ionicons name="pencil" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View className="mt-6 flex-row items-center justify-end">
            <TouchableOpacity onPress={handleReset} className="px-4 py-2 opacity-80">
                <Text className="font-semibold text-emerald-700">Reset to Defaults</Text>
            </TouchableOpacity>
        </View>

        <View className="mt-8 mb-[2px] h-px w-full bg-slate-200" />
        
        <View className="mt-4 mb-10">
          <CustomButton 
            title={saving ? "Saving..." : "Save Timings"} 
            onPress={handleSave} 
            disabled={saving}
          />
        </View>

      </ScrollView>

      <DateTimePickerModal
        isVisible={pickerVisible}
        mode="time"
        date={
          editingIndex !== null
            ? (() => {
                const d = new Date();
                d.setHours(reminders[editingIndex].hour, reminders[editingIndex].minute, 0, 0);
                return d;
              })()
            : new Date()
        }
        onConfirm={onConfirmTime}
        onCancel={() => {
          setPickerVisible(false);
          setEditingIndex(null);
        }}
      />
    </SafeAreaView>
  );
}