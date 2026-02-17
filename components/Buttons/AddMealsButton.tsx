import { Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type AddButton = {
  onPress: () => void;
}

export default function AddMealsButton({ onPress }: AddButton) {
  return (
    <View className='px-4 mb-1'> 
      <TouchableOpacity 
        className='bg-primary w-full py-4 rounded-full flex-row items-center justify-center'
        onPress={onPress}
      >
        {/* The Icon is now inside the button */}
        <MaterialIcons 
          name="add" 
          size={24} 
          color="white" 
          style={{ marginRight: 8 }} 
        />
        <Text className='text-[16px] text-white font-semibold'>Add New Meal</Text>
      </TouchableOpacity>
    </View>
  )
}