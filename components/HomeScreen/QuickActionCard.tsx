import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type QuickActionCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  iconColor: string;
  iconBackgroundColor: string;
  onPress: () => void;
};

export default function QuickActionCard({
  icon,
  title,
  subtitle,
  iconColor,
  iconBackgroundColor,
  onPress,
}: QuickActionCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="rounded-[24px] border border-emerald-100 bg-white px-4 py-4 shadow-sm"
    >
      <View
        className="h-12 w-12 items-center justify-center rounded-2xl"
        style={{ backgroundColor: iconBackgroundColor }}
      >
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>

      <Text className="mt-4 text-[15px] font-bold text-slate-900">
        {title}
      </Text>
      <Text className="mt-1 text-[12px] leading-5 text-slate-500">
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}
