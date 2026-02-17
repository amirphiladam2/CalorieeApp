import { Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { mealImages } from '@/constants/mealImages';
import { MealType } from '@/data/todayMeals';
import { Feather } from '@expo/vector-icons';

type MealsCardProps = {
  meal: MealType;
  calories: number;
  time: string;

  onEdit?: () => void;
  onDelete?: () => void;
}

export default function MealCard({
  meal,
  calories,
  time,
  onEdit,
  onDelete
}: MealsCardProps) {
  return (
    <View className="w-full bg-white self-center rounded-[20px] shadow-md mt-4">
      <View className="flex-row items-center p-4">

        {/* Image with better styling */}
        <View
          style={{
            width: 80,
            height: 80,
            backgroundColor: "#d6fbe8ff",
            borderRadius: 20,
            padding: 10,
          }}
        >
          <Image
            source={mealImages[meal]}
            resizeMode="contain"
            className="w-full h-full"
          />
        </View>

        {/* Meal Info with improved spacing */}
        <View className="flex-1 ml-4">
          <Text className="text-lg font-bold text-gray-900 mb-1">
            {meal}
          </Text>
          <View className="flex-row items-center gap-2">
            <View className="bg-emerald-100 px-3 py-1 rounded-full">
              <Text className="text-sm font-semibold text-emerald-700">
                {calories} cal
              </Text>
            </View>
            
            {/* Improved time display with icon */}
            <View className="flex-row items-center bg-gray-100 px-2.5 py-1 rounded-full">
              <Feather name="clock" size={12} color="#6B7280" />
              <Text className="text-sm font-medium text-gray-600 ml-1">
                {time}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons with better touch targets */}
        <View className="ml-3 gap-2">
          {onEdit && (
            <TouchableOpacity
              onPress={onEdit}
              className="bg-emerald-50 p-2.5 rounded-lg active:opacity-70"
              activeOpacity={0.7}
            >
              <Feather name="edit-2" size={18} color="#059669" />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              onPress={onDelete}
              className="bg-red-50 p-2.5 rounded-lg active:opacity-70"
              activeOpacity={0.7}
            >
              <Feather name="trash-2" size={18} color="#DC2626" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}