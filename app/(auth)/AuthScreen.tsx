import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View
} from 'react-native';

import { LoginScreen } from '@/components/screens/LoginScreen';
import { RegisterScreen } from '@/components/screens/RegisterScreen';
import { LinearGradient } from 'expo-linear-gradient';

const GRADIENT_COLORS = ['#0df2aaff', '#044c35d6'] as const;

export default function AuthScreen() {

  const [login, setLogin] = useState(true);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <LinearGradient
        colors={GRADIENT_COLORS}
        locations={[0.3, 0.4]}
        style={{ flex: 1 }}
      >
        {/**Header Container */}
        <View className="flex-[4] justify-center items-center">
          <Image
            className="h-80 w-90"
            resizeMode="contain"
            source={require('../../assets/images/AuthPic.png')}
          />
          <Text className="text-3xl font-extrabold text-white mt-[-2px]">
            Caloriee🍔
          </Text>
        </View>

        <View className="flex-[6] bg-white rounded-t-[60px] overflow-hidden">
          <ScrollView
            className="p-6"
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            {login ? (
              <LoginScreen onSwitch={() => setLogin(false)} />
            ) : (
              <RegisterScreen onSwitch={() => setLogin(true)} />
            )}

          </ScrollView>
        </View>

      </LinearGradient>
    </KeyboardAvoidingView>
  );
}