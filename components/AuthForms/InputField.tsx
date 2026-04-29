import { View, TextInput, Text, Pressable, type TextInputProps } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';

export interface InputFieldProps {
  icon?: keyof typeof Ionicons.glyphMap;
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: boolean;
  textContentType?: TextInputProps["textContentType"];
  variant?: "default" | "auth";
}

export const InputField = ({
  icon,
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  keyboardType,
  autoCapitalize = "sentences",
  autoCorrect = true,
  textContentType,
  variant = "default",
}: InputFieldProps) => {
  const isAuthVariant = variant === "auth";
  const isPasswordField = secureTextEntry;
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View className={isAuthVariant ? "mb-4" : "mb-3"}>
      {label && (
        <Text className={`mb-1 ml-1 text-xs font-semibold ${isAuthVariant ? "text-emerald-50/80" : "text-slate-700"}`}>
          {label}
        </Text>
      )}

      {/* Row: icon + input */}
      <View
        className={`
          flex-row items-center
          ${isAuthVariant ? "h-14 rounded-full bg-white/10 px-4" : "rounded-full bg-white px-4 py-1 shadow-md"}
          ${error ? "border border-red-500" : isAuthVariant ? "border border-white/10" : "border border-gray-300"}
        `}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isAuthVariant ? "#E3FFF2" : "#a0a0a0"}
            style={{ marginRight: 12 }}
          />
        )}

        <TextInput
          className={`flex-1 ${isAuthVariant ? "py-0 text-[14px] text-white" : "text-base text-gray-800"}`}
          placeholder={placeholder}
          placeholderTextColor={isAuthVariant ? "rgba(232,255,244,0.58)" : "#9ca3af"}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPasswordField ? isSecure : false}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          textContentType={textContentType}
        />

        {isPasswordField && (
          <Pressable
            onPress={() => setIsSecure((current) => !current)}
            className="ml-3"
            hitSlop={8}
          >
            <Ionicons
              name={isSecure ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={isAuthVariant ? "#E3FFF2" : "#6b7280"}
            />
          </Pressable>
        )}
      </View>

      {/* Error message */}
      {error && (
        <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
}
