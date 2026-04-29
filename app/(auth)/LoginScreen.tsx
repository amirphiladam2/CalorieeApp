import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from 'expo-router'
import React from 'react'
import { Controller, useForm } from "react-hook-form"
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import { supabase } from '../../lib/supabase'
import { LoginSchema, LoginSchemaType } from "../../schema/LoginSchema"
import { InputField } from '@/components/AuthForms/InputField'
import { CustomButton } from '@/components/Buttons/CustomButton'

export interface LoginScreenProp {
  onSwitch: () => void;
}

export default function LoginScreen({ onSwitch }: LoginScreenProp) {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    mode: "onSubmit",
  });


  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const { email, password } = data;

      const { error, data: authData } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        Alert.alert("Login failed", error.message);
        return;
      }
      console.log("Logged in", authData);
      router.replace('/home')
    }
    catch (err) {
      console.log("Unexpected error", err);
    }
  };

  const handleForgotPassword = async () => {
    const email = getValues("email")?.trim();

    if (!email) {
      Alert.alert("Enter your email", "Type your email first so we know where to send the reset link.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "caloriee://reset-password",
    });

    if (error) {
      Alert.alert("Reset failed", error.message);
      return;
    }

    Alert.alert(
      "Check your email",
      "Open the reset link on this device and you’ll be taken to the password reset screen."
    );
  };


  return (
    <View>
      <View className="mt-1">
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
              placeholder="Enter your password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              variant="auth"
            />
          )}
        />

        <TouchableOpacity
          className="mb-5 mt-1 self-end"
          onPress={handleForgotPassword}
          activeOpacity={0.8}
        >
          <Text className="text-sm font-semibold text-emerald-100">
            Forgot password?
          </Text>
        </TouchableOpacity>

        <CustomButton
          title="Sign In"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          loading={isSubmitting}
          loadingText='Signing in...'
          variant="auth"
          backgroundColor="white"
          textColor="#02422e"
        />

        <View className='mt-6 flex-row items-center justify-center'>
          <Text className="text-sm text-emerald-50/70">Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={onSwitch}>
            <Text className="text-sm font-semibold text-white">
              Create one
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
