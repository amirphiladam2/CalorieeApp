import { Meal } from '@/data/todayMeals';
import { useProfile } from '@/hooks/useProfile';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DailyCaloriesCard from './DailyCaloriesCard';

type HeaderProps = {
    meals: Meal[];
    goal: number;
};

export default function Header({ meals, goal }: HeaderProps) {

    const { profile, loading } = useProfile();

    const avatarUrl = profile?.avatar_url;
    const fullName = profile?.full_name ?? 'User';

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
            colors={['#0df2aaff', '#044c35d6']}
            locations={[0.1, 1]}
            style={{
                flex: 1,
                height: 400,
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25
            }}
        >
            <SafeAreaView className="flex-1 px-4 py-3">
                {/* User Info Section */}
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
                        <Text className="text-base text-white/90">
                            {greetingText}
                        </Text>
                        <Text className="text-lg font-bold text-white">
                            {loading ? '...' : fullName}
                        </Text>
                    </View>

                    <TouchableOpacity
                        className="p-2"
                        accessibilityLabel="Notifications"
                        accessibilityRole="button"
                    >
                        <FontAwesome name="bell" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View className='px-4 mt-4'>
                    {/* Daily Calories Card */}
                    <DailyCaloriesCard
                        consumed={totalCalories}
                        goal={goal}
                        protein={macros.protein}
                        carbs={macros.carbs}
                        fats={macros.fats}
                    />
                </View>

            </SafeAreaView>
        </LinearGradient >
    );
}