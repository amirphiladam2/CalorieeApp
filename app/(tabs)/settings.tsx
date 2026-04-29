import SettingCard from "@/components/Settings/SettingCard";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    cancelMealRemindersAsync,
    getStoredNotificationPreferences,
    registerForPushNotificationsAsync,
    scheduleMealRemindersAsync,
    setStoredMealRemindersEnabled,
    setStoredPushNotificationsEnabled,
} from "@/services/notifications";
import { updateProfile } from "@/services/profileService";
import ProfileScreen from "../(screens)/ProfileScreen";

const Divider = () => <View className="ml-[84px] h-px bg-slate-100" />;

const Settings = () => {
  const { user } = useAuth();
  const { profile, refetch } = useProfile();
  const [pushNotifications, setPushNotifications] = useState(false);
  const [mealReminders, setMealReminders] = useState(false);
  const [preferencesLoading, setPreferencesLoading] = useState(true);
  const [savingPushNotifications, setSavingPushNotifications] = useState(false);
  const [savingMealReminders, setSavingMealReminders] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const loadNotificationPreferences = async () => {
      try {
        const storedPreferences = await getStoredNotificationPreferences({
          pushNotifications: profile?.push_notifications_enabled ?? false,
          mealReminders: profile?.meal_reminders_enabled ?? false,
        });

        if (!active) {
          return;
        }

        setPushNotifications(storedPreferences.pushNotifications);
        setMealReminders(storedPreferences.mealReminders);
      } catch (error) {
        console.error("Failed to load notification preferences", error);
      } finally {
        if (active) {
          setPreferencesLoading(false);
        }
      }
    };

    void loadNotificationPreferences();

    return () => {
      active = false;
    };
  }, [
    profile?.meal_reminders_enabled,
    profile?.push_notifications_enabled,
  ]);

  const togglePushNotifications = async (value: boolean) => {
    if (!user || !profile) {
      Alert.alert(
        "Account unavailable",
        "Sign in again before updating notification preferences."
      );
      return;
    }

    try {
      setSavingPushNotifications(true);

      if (value) {
        const expoPushToken = await registerForPushNotificationsAsync();
        await setStoredPushNotificationsEnabled(true);
        await updateProfile(profile.id, {
          expo_push_token: expoPushToken,
          push_notifications_enabled: true,
        });
        setPushNotifications(true);
        Alert.alert(
          "Push notifications enabled",
          "This device is now registered for Caloriee push notifications."
        );
      } else {
        await setStoredPushNotificationsEnabled(false);
        await updateProfile(profile.id, {
          expo_push_token: null,
          push_notifications_enabled: false,
        });
        setPushNotifications(false);
      }

      await refetch();
    } catch (error) {
      Alert.alert(
        "Unable to update push notifications",
        error instanceof Error
          ? error.message
          : "Push notifications could not be updated right now."
      );
    } finally {
      setSavingPushNotifications(false);
    }
  };

  const toggleMealReminders = async (value: boolean) => {
    if (!user || !profile) {
      Alert.alert(
        "Account unavailable",
        "Sign in again before updating meal reminders."
      );
      return;
    }

    try {
      setSavingMealReminders(true);

      if (value) {
        await scheduleMealRemindersAsync();
        await setStoredMealRemindersEnabled(true);
        await updateProfile(profile.id, {
          meal_reminders_enabled: true,
        });
        setMealReminders(true);
        Alert.alert(
          "Meal reminders active",
          "Daily reminders are scheduled for 8:00 AM, 1:00 PM, 4:00 PM, and 7:00 PM."
        );
      } else {
        await cancelMealRemindersAsync();
        await setStoredMealRemindersEnabled(false);
        await updateProfile(profile.id, {
          meal_reminders_enabled: false,
        });
        setMealReminders(false);
      }

      await refetch();
    } catch (error) {
      Alert.alert(
        "Unable to update meal reminders",
        error instanceof Error
          ? error.message
          : "Meal reminders could not be updated right now."
      );
    } finally {
      setSavingMealReminders(false);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.replace("/(auth)/AuthScreen");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F8F5]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-4 pt-2">
          <Text className="text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-700">
            Control Center
          </Text>
          <Text className="mt-1 text-[30px] font-black text-slate-900">
            Settings
          </Text>
          <Text className="mt-2 text-sm leading-6 text-slate-500">
            Manage your profile, reminders, and account security from one polished space.
          </Text>
        </View>

        <View className="mt-5 px-4">
          <ProfileScreen />
        </View>

        <View className="mt-7 px-4">
          <Text className="text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-700">
            Profile
          </Text>
          <Text className="mt-1 text-[22px] font-black text-slate-900">
            Personal Setup
          </Text>
          <Text className="mt-2 text-sm text-slate-500">
            Update your identity and calorie targets.
          </Text>

          <View className="mt-3 overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-sm">
            <SettingCard
              onPress={() => router.push("/(screens)/PersonalInformation")}
              icon="person-outline"
              title="Personal Information"
              subtitle="Name, username, and profile details"
            />
            <Divider />
            <SettingCard
              onPress={() => router.push("/(screens)/GoalsTargets")}
              icon="flag-outline"
              title="Goals & Targets"
              subtitle="Daily calorie and body-weight targets"
              iconColor="#D97706"
              iconBackgroundColor="#FEF3C7"
            />
          </View>
        </View>

        <View className="mt-7 px-4">
          <Text className="text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-700">
            Notifications
          </Text>
          <Text className="mt-1 text-[22px] font-black text-slate-900">
            Daily Nudges
          </Text>
          <Text className="mt-2 text-sm text-slate-500">
            Control the reminders that keep your habits consistent.
          </Text>

          <View className="mt-3 overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-sm">
            <SettingCard
              onPress={() => togglePushNotifications(!pushNotifications)}
              icon="notifications-outline"
              title="Push Notifications"
              subtitle="General alerts and account updates"
              iconColor="#7C3AED"
              iconBackgroundColor="#F3E8FF"
              isSwitch
              switchValue={pushNotifications}
              onSwitchChange={togglePushNotifications}
              disabled={preferencesLoading || savingPushNotifications}
            />
            <Divider />
            <SettingCard
              onPress={() => toggleMealReminders(!mealReminders)}
              icon="restaurant-outline"
              title="Meal Reminders"
              subtitle="Get reminded when it’s time to log meals"
              iconColor="#D97706"
              iconBackgroundColor="#FEF3C7"
              isSwitch
              switchValue={mealReminders}
              onSwitchChange={toggleMealReminders}
              disabled={preferencesLoading || savingMealReminders}
            />
            <Divider />
            <SettingCard
              onPress={() => router.push("/(screens)/MealReminderSettings")}
              icon="timer-outline"
              title="Reminder Settings"
              subtitle="Customize alert timings and actions"
              iconColor="#10B981"
              iconBackgroundColor="#D1FAE5"
            />
          </View>
        </View>

        <View className="mt-7 px-4">
          <Text className="text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-700">
            Security
          </Text>
          <Text className="mt-1 text-[22px] font-black text-slate-900">
            Privacy & Access
          </Text>
          <Text className="mt-2 text-sm text-slate-500">
            Password reset and privacy controls for your account.
          </Text>

          <View className="mt-3 overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-sm">
            <SettingCard
              onPress={() => router.push("/(screens)/PrivacySecurity")}
              icon="shield-checkmark-outline"
              title="Privacy & Security"
              subtitle="Password reset and account protection"
              iconColor="#2563EB"
              iconBackgroundColor="#DBEAFE"
            />
          </View>
        </View>

        <View className="mt-7 px-4">
          <Text className="text-[12px] font-semibold uppercase tracking-[1.5px] text-red-600">
            Account
          </Text>
          <Text className="mt-1 text-[22px] font-black text-slate-900">
            Session
          </Text>
          <Text className="mt-2 text-sm text-slate-500">
            Sign out safely when you’re done.
          </Text>

          <View className="mt-3 overflow-hidden rounded-[28px] border border-red-100 bg-white shadow-sm">
            <SettingCard
              onPress={signOut}
              icon="log-out-outline"
              title="Logout"
              subtitle="Sign out from your account on this device"
              iconColor="#DC2626"
              iconBackgroundColor="#FEE2E2"
              danger
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
