import { supabase } from '@/lib/supabase';
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { RegisterSchema, RegisterSchemaType } from "../../schema/RegisterSchema";
import { InputField } from '@/components/AuthForms/InputField';
import { CustomButton } from '@/components/Buttons/CustomButton';

export interface RegisterScreenProp {
  onSwitch: () => void;
}
export default function RegisterScreen({ onSwitch }: RegisterScreenProp){
  const router = useRouter();

  const {
    control, handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    mode: "onSubmit",
  })

  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      const { name, email, password } = data;

      const { error, data: authData } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        Alert.alert("Register failed", error.message);
        return;
      }

      console.log("Registered", authData);
      router.replace('/home');

    }
    catch (err) {
      console.log("Unexpected error", err)
    }
  };



  return (
    <View>
      <View className="mt-1">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <InputField
              icon="person-sharp"
              label="Full Name"
              placeholder="Enter your name"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
              textContentType="name"
              variant="auth"
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <InputField
              icon="mail"
              label="Email"
              placeholder="Enter your email"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              variant="auth"
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <InputField
              icon="lock-closed-outline"
              label="Password"
              placeholder="Create a password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              variant="auth"
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <InputField
              icon="shield-checkmark-outline"
              label="Confirm Password"
              placeholder="Confirm your password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              error={errors.confirmPassword?.message}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              variant="auth"
            />
          )}
        />

        <CustomButton
          title="Create Account"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          loading={isSubmitting}
          loadingText='Creating account...'
          variant="auth"
          backgroundColor="white"
          textColor="#02422e"
        />

        <View className="mt-6 flex-row items-center justify-center">
          <Text className="text-sm text-emerald-50/70">
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={onSwitch}>
            <Text className="text-sm font-semibold text-white">
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
