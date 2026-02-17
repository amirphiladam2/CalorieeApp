import { Text, View, Pressable } from 'react-native'
import React from 'react'

type MealCategoryCardProps = {
  title: string;
  emoji: string;
  bgColor: string;
  textColor: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function MealCategoryCard({ title, emoji, bgColor, textColor, isSelected, onPress }: MealCategoryCardProps) {
  return (
    <Pressable 
      onPress={onPress}
      style={[
        { backgroundColor: bgColor },
        isSelected && { borderWidth: 2, borderColor: textColor } 
      ]}
      className='h-[110px] w-[105px] rounded-[24px] items-center justify-center p-2 mx-1'
    >
      <View className='mb-2'>
        <Text style={{ fontSize: 30 }}>{emoji}</Text>
      </View>

      <Text 
        style={{ color: textColor }} 
        className={`font-bold text-[14px] ${isSelected ? 'opacity-100' : 'opacity-80'}`}
      >
        {title}
      </Text>
    </Pressable>
  )
}