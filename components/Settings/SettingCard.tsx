import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";

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
  danger?: boolean;
  disabled?: boolean;
};

const SettingCard = ({
  icon,
  title,
  subtitle,
  onPress,
  iconColor = "#0F9F67",
  iconBackgroundColor = "#ECFDF5",
  isSwitch = false,
  switchValue = false,
  onSwitchChange,
  danger = false,
  disabled = false,
}: SettingCardProps) => {
  const titleColor = danger ? "#DC2626" : "#0F172A";
  const subtitleColor = danger ? "#991B1B" : "#64748B";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.78}
      className="flex-row items-center px-5 py-4"
      style={{ opacity: disabled ? 0.6 : 1 }}
    >
      {icon ? (
        <View
          className="mr-4 h-12 w-12 items-center justify-center rounded-2xl"
          style={{ backgroundColor: iconBackgroundColor }}
        >
          <Ionicons name={icon} size={22} color={iconColor} />
        </View>
      ) : null}

      <View className="flex-1 pr-3">
        <Text className="text-[16px] font-bold" style={{ color: titleColor }}>
          {title}
        </Text>
        <Text
          className="mt-1 text-[13px] leading-5"
          style={{ color: subtitleColor }}
        >
          {subtitle}
        </Text>
      </View>

      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          disabled={disabled}
          trackColor={{ false: "#D1D5DB", true: `${iconColor}55` }}
          thumbColor={switchValue ? iconColor : "#F8FAFC"}
        />
      ) : (
        <View className="h-9 w-9 items-center justify-center rounded-full bg-slate-100">
          <Ionicons
            name="chevron-forward"
            size={18}
            color={danger ? "#F87171" : "#94A3B8"}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SettingCard;
