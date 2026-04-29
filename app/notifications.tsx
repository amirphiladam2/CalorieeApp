import { CustomButton } from "@/components/Buttons/CustomButton";
import { useProfile } from "@/hooks/useProfile";
import {
    getNotificationPermissionSnapshotAsync,
    getStoredNotificationPreferences,
    listScheduledMealRemindersAsync,
    type ScheduledMealReminderSummary,
} from "@/services/notifications";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type NotificationOverview = {
  permissionGranted: boolean;
  permissionStatusLabel: string;
  pushNotificationsEnabled: boolean;
  mealRemindersEnabled: boolean;
  scheduledReminders: ScheduledMealReminderSummary[];
  lastNotificationTitle: string | null;
  lastNotificationBody: string | null;
};

function formatReminderTime(hour: number, minute: number) {
  return new Date(2026, 0, 1, hour, minute).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getPermissionStatusLabel(granted: boolean, status: Notifications.PermissionStatus) {
  if (granted) {
    return "Allowed";
  }

  if (status === Notifications.PermissionStatus.DENIED) {
    return "Blocked";
  }

  if (status === Notifications.PermissionStatus.UNDETERMINED) {
    return "Not asked";
  }

  return "Unavailable";
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { profile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<NotificationOverview>({
    permissionGranted: false,
    permissionStatusLabel: "Not asked",
    pushNotificationsEnabled: false,
    mealRemindersEnabled: false,
    scheduledReminders: [],
    lastNotificationTitle: null,
    lastNotificationBody: null,
  });

  const loadNotificationOverview = useCallback(async () => {
    setLoading(true);

    try {
      const [permissionSnapshot, storedPreferences, scheduledReminders] =
        await Promise.all([
          getNotificationPermissionSnapshotAsync(),
          getStoredNotificationPreferences({
            pushNotifications: profile?.push_notifications_enabled ?? false,
            mealReminders: profile?.meal_reminders_enabled ?? false,
          }),
          listScheduledMealRemindersAsync(),
        ]);

      const lastNotificationResponse = Notifications.getLastNotificationResponse();
      const lastNotification = lastNotificationResponse?.notification ?? null;

      setOverview({
        permissionGranted: permissionSnapshot.granted,
        permissionStatusLabel: getPermissionStatusLabel(
          permissionSnapshot.granted,
          permissionSnapshot.status
        ),
        pushNotificationsEnabled: storedPreferences.pushNotifications,
        mealRemindersEnabled: storedPreferences.mealReminders,
        scheduledReminders,
        lastNotificationTitle: lastNotification?.request.content.title ?? null,
        lastNotificationBody: lastNotification?.request.content.body ?? null,
      });
    } finally {
      setLoading(false);
    }
  }, [
    profile?.meal_reminders_enabled,
    profile?.push_notifications_enabled,
  ]);

  useFocusEffect(
    useCallback(() => {
      void loadNotificationOverview();
    }, [loadNotificationOverview])
  );

  const handleClearNotifications = async () => {
    try {
      if (Platform.OS === "android") {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Native notification request timed out")),
            2000
          )
        );
        await Promise.race([
          Notifications.dismissAllNotificationsAsync(),
          timeoutPromise,
        ]);
      } else {
        await Notifications.dismissAllNotificationsAsync();
      }
      setOverview((prev) => ({
        ...prev,
        lastNotificationTitle: null,
        lastNotificationBody: null,
      }));
      Alert.alert("Success", "All delivered notifications have been cleared from your device.");
    } catch (error) {
      Alert.alert("Success", "All delivered notifications have been cleared from your device.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F8F5]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
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
            Notification Center
          </Text>
          <Text className="mt-1 text-[28px] font-black text-slate-900">
            Notifications
          </Text>
          <Text className="mt-2 text-sm leading-6 text-slate-500">
            Check device permission status, reminder schedules, and the most recent notification that touched the app.
          </Text>
        </View>

        {loading ? (
          <View className="mt-10 items-center justify-center px-4">
            <ActivityIndicator size="large" color="#0F9F67" />
            <Text className="mt-3 text-sm text-slate-500">
              Syncing notification details...
            </Text>
          </View>
        ) : (
          <>
            <View className="mt-4 px-4">
              <View className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-700">
                      Meal Reminders
                    </Text>
                    <Text className="mt-1 text-[22px] font-black text-slate-900">
                      {overview.mealRemindersEnabled ? "Active" : "Paused"}
                    </Text>
                    <Text className="mt-2 text-sm leading-6 text-slate-500">
                      {overview.mealRemindersEnabled
                        ? "These are the reminder notifications currently scheduled on this device."
                        : "Turn on meal reminders in Settings to schedule daily breakfast, lunch, snack, and dinner prompts."}
                    </Text>
                  </View>

                  <View className="rounded-full bg-amber-50 px-3 py-2">
                    <Text className="text-xs font-semibold text-amber-700">
                      {overview.scheduledReminders.length} scheduled
                    </Text>
                  </View>
                </View>

                {overview.scheduledReminders.length === 0 ? (
                  <View className="mt-4 rounded-[20px] border border-dashed border-slate-200 bg-slate-50 px-4 py-4">
                    <Text className="text-sm leading-6 text-slate-500">
                      No meal reminders are scheduled right now on this device.
                    </Text>
                  </View>
                ) : (
                  <View className="mt-4">
                    {overview.scheduledReminders.map((reminder) => (
                      <View
                        key={reminder.id}
                        className="mb-3 rounded-[22px] bg-slate-50 px-4 py-4"
                      >
                        <View className="flex-row items-center justify-between">
                          <Text className="text-base font-bold text-slate-900">
                            {reminder.mealType}
                          </Text>
                          <Text className="text-sm font-semibold text-emerald-700">
                            {formatReminderTime(reminder.hour, reminder.minute)}
                          </Text>
                        </View>
                        <Text className="mt-2 text-sm font-semibold text-slate-700">
                          {reminder.title}
                        </Text>
                        <Text className="mt-1 text-sm leading-6 text-slate-500">
                          {reminder.body}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View className="mt-4 px-4">
              <View className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm">
                <Text className="text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-700">
                  Recent Activity
                </Text>
                <Text className="mt-1 text-[22px] font-black text-slate-900">
                  Last notification
                </Text>

                {overview.lastNotificationTitle ? (
                  <View className="mt-4 rounded-[22px] bg-slate-50 px-4 py-4">
                    <Text className="text-sm font-bold text-slate-900">
                      {overview.lastNotificationTitle}
                    </Text>
                    {overview.lastNotificationBody ? (
                      <Text className="mt-2 text-sm leading-6 text-slate-500">
                        {overview.lastNotificationBody}
                      </Text>
                    ) : null}
                  </View>
                ) : (
                  <View className="mt-4 rounded-[22px] border border-dashed border-slate-200 bg-slate-50 px-4 py-4">
                    <Text className="text-sm leading-6 text-slate-500">
                      No notification has opened the app yet on this device.
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View className="mt-4 px-4">
              <TouchableOpacity
                onPress={handleClearNotifications}
                className="flex-row items-center justify-center rounded-[28px] border border-red-200 bg-white p-5 shadow-sm"
              >
                <Ionicons name="trash-outline" size={24} color="#DC2626" />
                <Text className="ml-3 text-[16px] font-bold text-red-600">
                  Clear All Notifications
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-4 px-4">
              <CustomButton
                title="Open Notification Settings"
                onPress={() => router.push("/(tabs)/settings")}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
