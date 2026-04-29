import { Meal } from '@/data/todayMeals';
import type { Profile } from '@/hooks/useProfile';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DailyCaloriesCard from './DailyCaloriesCard';

type HeaderProps = {
    meals: Meal[];
    goal: number;
    profile: Profile | null;
    profileLoading: boolean;
};

export default function Header({
    meals,
    goal,
    profile,
    profileLoading,
}: HeaderProps) {
    const avatarUrl = profile?.avatar_url;
    const fullName = profile?.full_name ?? 'User';
    const displayName = fullName.trim() || 'User';
    const showNamePlaceholder = profileLoading && !profile;

    const greetingText = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning ☀️';
        if (hour < 18) return 'Good afternoon 🌤️';
        return 'Good evening 🌙';
    }, []);


    const totalCalories = meals.reduce(
        (sum, m) => sum + m.calories,
        0
    );
    const remainingCalories = Math.max(goal - totalCalories, 0);

    const macros = meals.reduce(
        (acc, m) => ({
            protein: acc.protein + (m.protein ?? 0),
            carbs: acc.carbs + (m.carbs ?? 0),
            fats: acc.fats + (m.fats ?? 0),
        }),
        { protein: 0, carbs: 0, fats: 0 }
    );


    return (
        <LinearGradient
            colors={['#0C6B4A', '#084E38', '#04291E']}
            locations={[0.05, 0.45, 1]}
            style={{
                flex: 1,
                minHeight: 340,
                borderBottomLeftRadius: 34,
                borderBottomRightRadius: 34,
                overflow: 'hidden',
            }}
        >
            <View
                pointerEvents="none"
                style={{
                    position: 'absolute',
                    right: -30,
                    top: 10,
                    width: 160,
                    height: 160,
                    borderRadius: 999,
                    backgroundColor: 'rgba(255,255,255,0.12)',
                }}
            />
            <View
                pointerEvents="none"
                style={{
                    position: 'absolute',
                    left: -40,
                    top: 120,
                    width: 120,
                    height: 120,
                    borderRadius: 999,
                    backgroundColor: 'rgba(84,255,186,0.12)',
                }}
            />
            <SafeAreaView className="flex-1 px-4 py-3">
                <View className="flex-row items-center">
                    <TouchableOpacity className="h-16 w-16 rounded-full border border-gray-100 overflow-hidden bg-gray-300">
                        <Image
                            source={
                                avatarUrl
                                    ? { uri: avatarUrl }
                                    : require('../../assets/images/user.png')
                            }
                            resizeMode="cover"
                            className="w-full h-full"
                        />
                    </TouchableOpacity>

                    <View className="ml-4 flex-1">
                        <Text className="text-sm text-white/80">
                            {greetingText}
                        </Text>
                        <Text className="text-xl font-black text-white">
                            {showNamePlaceholder ? '...' : displayName}
                        </Text>
                    </View>
                </View>

                <View className="mt-5 flex-row flex-wrap">
                    <View className="mr-3 mb-3 rounded-full border border-white/15 bg-white/10 px-4 py-2">
                        <Text className="text-xs font-semibold uppercase tracking-wide text-white/90">
                            {meals.length} meals logged
                        </Text>
                    </View>
                    <View className="mb-3 rounded-full border border-white/15 bg-white/10 px-4 py-2">
                        <Text className="text-xs font-semibold uppercase tracking-wide text-white/90">
                            {remainingCalories} cal left
                        </Text>
                    </View>
                </View>

                <View className='mt-3'>
                    <DailyCaloriesCard
                        consumed={totalCalories}
                        goal={goal}
                        protein={macros.protein}
                        carbs={macros.carbs}
                        fats={macros.fats}
                        proteinGoal={profile?.protein_goal}
                        carbsGoal={profile?.carbs_goal}
                        fatsGoal={profile?.fats_goal}
                    />
                </View>

            </SafeAreaView>
        </LinearGradient >
    );
}
