import { Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';

export const Color = {
    iconColor: '#08b67fff'
}
type MealDatePickerProps = {
    date: string;
    onPickDate: () => void;
    onSetToday: () => void;
    onSetTomorrow: () => void;
}
const MealDatePicker = ({ date, onPickDate, onSetToday, onSetTomorrow }: MealDatePickerProps) => {
    return (
        <View className="bg-white border border-gray-200 rounded-[15px] px-4 py-3 mb-6 text-gray-900">
            <Text className='text-[10px]'>Date of Adding Meal</Text>
            <View className='flex-row justify-between '>
                <TouchableOpacity
                    onPress={onPickDate}
                    className='flex-row gap-2 items-center'
                >
                    <Ionicons
                        name="calendar-number"
                        size={24}
                        color={Color.iconColor}
                    />
                    <Text className='font-bold'>{date}</Text>
                </TouchableOpacity>

                <View className="flex-row items-center gap-3">
                    <TouchableOpacity onPress={onSetToday}
                        className='bg-[#08b67f94] py-2 px-4 rounded-full'
                    >
                        <Text className="text-white font-medium">Today</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onSetTomorrow}
                        className='bg-[#08b67f94] py-2 px-4 rounded-full'>
                        <Text className="text-white font-medium">Tomorrow</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}

export default MealDatePicker

