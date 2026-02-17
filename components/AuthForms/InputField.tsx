import { View, TextInput, Text } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';

export interface InputFieldProps {
  icon?: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
}

export const InputField = ({ icon, placeholder, value, onChangeText, secureTextEntry = false, error }: InputFieldProps) => {
  return (
    <View className="mb-4">
      {/* Row: icon + input */}
      <View
        className={`
          flex-row items-center bg-white rounded-full px-4 py-1 shadow-md
          ${error ? "border border-red-500" : "border border-gray-300"}
        `}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={22}
            color="#a0a0a0"
            style={{ marginRight: 12 }}
          />
        )}

        <TextInput
          className="flex-1 text-base text-gray-800"
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
        />
      </View>

      {/* Error message */}
      {error && (
        <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
}