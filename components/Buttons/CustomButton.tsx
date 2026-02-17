import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  disabled?:boolean;
  loading?:boolean;
  loadingText?:string;
}

export const CustomButton = ({ title, onPress, disabled, loading,loadingText }: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.8}
      disabled={disabled}
      style={{ opacity: disabled ? 0.6 : 1 }}
    >
      <LinearGradient
        colors={['#05cc8dff', '#08b67fff']}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 99,
          alignItems: 'center',
        }}
      >
        <Text className="text-white font-bold text-base">
          {loading ?loadingText?? title:title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

