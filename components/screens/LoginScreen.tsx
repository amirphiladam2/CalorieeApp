import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from 'expo-router'
import React from 'react'
import { Controller, useForm } from "react-hook-form"
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import { supabase } from '../../lib/supabase'
import { LoginSchema, LoginSchemaType } from "../../schema/LoginSchema"
import { InputField } from '../AuthForms/InputField'
import { CustomButton } from '../Buttons/CustomButton'
import GoogleSignInButton from '../Buttons/GoogleSignButton'

export interface LoginScreenProp {
  onSwitch: () => void;
}

export const LoginScreen = ({ onSwitch }: LoginScreenProp) => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
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


  return (
    <View>

      {/* Welcome */}
      <View className="p-2 items-center">
        <Text className="text-[24px] font-bold text-gray-600">Hey welcome back!</Text>
      </View>

      {/* Input fields */}
      <View className="px-4 mt-2">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <InputField
              icon="mail"
              placeholder="Enter your email"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <InputField
              icon="lock-closed-outline"
              placeholder="Enter your password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
            />
          )}
        />
      

      {/* Forgot Password */}
      <TouchableOpacity className="self-end p-2">
        <Text className="text-['#08b67fff'] text-base font-semibold">Forgot Password</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <CustomButton
        title="Login"
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        loading={isSubmitting}
        loadingText='Logging in...'
      />

      <View className="flex-row items-center mt-4 w-full">
        <View className="flex-1 border-b" style={{ borderBottomColor: '#949393ff', borderBottomWidth: 1.2 }} />
        <Text className="mx-3 text-gray-700 text-base">OR</Text>
        <View className="flex-1 border-b" style={{ borderBottomColor: '#949393ff', borderBottomWidth: 1.2 }} />
      </View>


      <GoogleSignInButton />

      {/* Register link */}
      <View className='flex-row justify-center items-center mt-6'>
        <Text className="text-gray-600 text-base">Don't have an account? </Text>
        <TouchableOpacity onPress={onSwitch}>
          <Text className="text-primary text-base font-semibold underline">
            Register
          </Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
};
