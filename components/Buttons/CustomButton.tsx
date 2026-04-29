import { Text, TouchableOpacity } from 'react-native';
import React from 'react';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  disabled?:boolean;
  loading?:boolean;
  loadingText?:string;
  variant?: "default" | "auth";
  backgroundColor?: string;
  textColor?: string;
}

const SECONDARY_COLOR = "#059669";
const DEFAULT_TEXT_COLOR = "#FFFFFF";

export const CustomButton = ({
  title,
  onPress,
  disabled,
  loading,
  loadingText,
  variant = "default",
  backgroundColor = SECONDARY_COLOR,
  textColor = DEFAULT_TEXT_COLOR,
}: ButtonProps) => {
  const isAuthVariant = variant === "auth";

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.8}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.6 : 1,
        backgroundColor,
        height: isAuthVariant ? 44 : undefined,
        paddingVertical: isAuthVariant ? 0 : 12,
        paddingHorizontal: 16,
        borderRadius: 99,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        className={`font-bold ${isAuthVariant ? 'text-sm' : 'text-base'}`}
        style={{ color: textColor }}
      >
        {loading ?loadingText?? title:title}
      </Text>
    </TouchableOpacity>
  );
};
