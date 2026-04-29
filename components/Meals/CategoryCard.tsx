import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type CategoryCardProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  bgColor: string;
  activeBgColor: string;
  textColor: string;
  activeTextColor: string;
  isActive: boolean;
  onPress: () => void;
};

export default function CategoryCard({
  label,
  icon,
  bgColor,
  activeBgColor,
  textColor,
  activeTextColor,
  isActive,
  onPress,
}: CategoryCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="mr-3 flex-row items-center rounded-full border px-4 py-3"
      style={{
        backgroundColor: isActive ? activeBgColor : "#FFFFFF",
        borderColor: isActive ? activeBgColor : bgColor,
      }}
    >
      <View
        className="mr-3 h-10 w-10 items-center justify-center rounded-full"
        style={{
          backgroundColor: isActive ? "rgba(255,255,255,0.18)" : bgColor,
        }}
      >
        <Ionicons
          name={icon}
          size={20}
          color={isActive ? activeTextColor : textColor}
        />
      </View>

      <Text
        className="text-sm font-semibold"
        style={{
          color: isActive ? activeTextColor : textColor,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
