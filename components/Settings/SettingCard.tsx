import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';

type SettingCardProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
  iconColor?: string;
  iconBackgroundColor?: string;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}
const SettingCard = ({
  icon,
  title,
  subtitle,
  onPress,
  iconColor = "#0c83f2",
  iconBackgroundColor = "#eff6ff",
  isSwitch = false,
  switchValue,
  onSwitchChange,
}: SettingCardProps) => {
  return (
    <TouchableOpacity
      className='w-full py-2 bg-white self-center rounded-[20px] shadow-sm mb-3 mx-4'
      onPress={isSwitch ? undefined : onPress}
      activeOpacity={isSwitch ? 1 : 0.7}
    >

      <View className='flex-row items-center p-4'>
        <View
          className='w-14 h-14 rounded-xl items-center justify-center mr-4'
          style={{ backgroundColor: iconBackgroundColor }}
        >
          <Ionicons name={icon} size={22} color={iconColor} />
        </View>

        <View className='flex-1'>
          <Text className='text-[16px] font-bold text-gray-800'>{title}</Text>
          <Text className='text-[13px] font-medium text-gray-500 mt-0.5'>{subtitle}</Text>
        </View>
        <View>
          {isSwitch ? (
            <Switch
              value={switchValue}
              onValueChange={onSwitchChange}
              trackColor={{ false: "#d1d5db", true: iconColor + "80" }} // adding opacity to track
              thumbColor={switchValue ? iconColor : "#f4f3f4"}
            />
          ) : (
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default SettingCard

