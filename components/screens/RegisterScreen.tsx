import { supabase } from '@/lib/supabase';
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { RegisterSchema, RegisterSchemaType } from "../../schema/RegisterSchema";
import { InputField } from '../AuthForms/InputField';
import { CustomButton } from '../Buttons/CustomButton';

export interface RegisterScreenProp {
  onSwitch: () => void;
}
export const RegisterScreen = ({ onSwitch }: RegisterScreenProp) => {
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
    <View className="flex-1 px-4">

      {/* Title */}
      <View className="items-center p-4">
        <Text className="font-extrabold text-[24px] text-gray-600">
          Create an Account
        </Text>
      </View>

      {/* Form */}

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <InputField
            icon="person-sharp"
            placeholder="Enter your name"
            value={value}
            onChangeText={onChange}
            error={errors.name?.message}
          />
        )}
      />
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
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <InputField
            icon="lock-closed-outline"
            placeholder="Confirm password"
            secureTextEntry
            value={value}
            onChangeText={onChange}
            error={errors.confirmPassword?.message}
          />
        )}
      />
      <CustomButton
        title="Register"
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        loading={isSubmitting}
        loadingText='Registering'
      />

      {/* Go Back To Login */}
      <View className="flex-row justify-center items-center mt-6">
        <Text className="text-gray-600 text-base]">
          Already have an account?
        </Text>
        <TouchableOpacity onPress={onSwitch}>
          <Text className="text-primary text-base font-semibold underline">
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
