import SettingCard from '@/components/Settings/SettingCard'
import { supabase } from '@/lib/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProfileScreen from '../(screens)/ProfileScreen'

const profile = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [mealReminders, setMealReminders] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const pn = await AsyncStorage.getItem('pushNotifications');
      const mr = await AsyncStorage.getItem('mealReminders');
      if (pn !== null) setPushNotifications(JSON.parse(pn));
      if (mr !== null) setMealReminders(JSON.parse(mr));
    } catch (e) {
      console.error("Failed to load settings", e);
    }
  };

  const togglePushNotifications = async (value: boolean) => {
    setPushNotifications(value);
    await AsyncStorage.setItem('pushNotifications', JSON.stringify(value));
  };

  const toggleMealReminders = async (value: boolean) => {
    setMealReminders(value);
    await AsyncStorage.setItem('mealReminders', JSON.stringify(value));
  };

  const router = useRouter();
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.replace('/(auth)/AuthScreen')
    }
  }
  return (
    <SafeAreaView className='flex-1'>
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className='p-4'>
          <Text className='text-[24px] text-gray-700 font-bold'>Settings</Text>
          <Text className='text-[16px] text-gray-600'>Manage your preferences</Text>
        </View>

        <ProfileScreen />
        <Text className='text-base font-semibold text-gray-600 p-2 mt-2'>PROFILE</Text>

        <SettingCard
          onPress={() => router.push('/(screens)/PersonalInformation')}
          icon='person'
          title='Personal Information'
          subtitle='Manage your profile'
        />
        <SettingCard
          onPress={() => router.push('/(screens)/GoalsTargets')}
          icon='trophy'
          title='Goals & Targets'
          subtitle='Manage your goals'
          iconColor='#F59E0B'
          iconBackgroundColor='#FEF3C7'
        />
        <Text className='text-base font-semibold text-gray-600 p-2 mt-4'>NOTIFICATIONS</Text>
        <SettingCard
          onPress={() => togglePushNotifications(!pushNotifications)}
          icon='notifications'
          title='Push Notifications'
          subtitle='Manage your notifications'
          iconColor='#d913f1ff'
          iconBackgroundColor='#f3d9ffff'
          isSwitch
          switchValue={pushNotifications}
          onSwitchChange={togglePushNotifications}
        />
        <SettingCard
          onPress={() => toggleMealReminders(!mealReminders)}
          icon='fast-food'
          title='Meal Reminders'
          subtitle="Get notified when it's time to eat"
          iconColor='#26f50bff'
          iconBackgroundColor='#dbfec7ff'
          isSwitch
          switchValue={mealReminders}
          onSwitchChange={toggleMealReminders}
        />
        <Text className='text-base font-semibold text-gray-600 p-2 mt-4'>SECURITY & PRIVACY</Text>
        <SettingCard
          onPress={() => router.push('/(screens)/PrivacySecurity')}
          icon='lock-closed'
          title='Privacy & Security'
          subtitle="Manage your privacy settings"
          iconColor='#09000cff'
          iconBackgroundColor='#f0e8f7ff'
        />

        <Text className='text-base font-semibold text-gray-600 p-2 mt-4'>ACCOUNT</Text>
        <SettingCard
          onPress={signOut}
          icon='log-out'
          title='Logout'
          subtitle="Logout from your account"
          iconColor='#f33838ff'
          iconBackgroundColor='#ffd7d7ff'
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default profile
