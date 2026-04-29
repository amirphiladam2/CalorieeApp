import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import LoginScreen from '@/app/(auth)/LoginScreen';
import RegisterScreen from '@/app/(auth)/RegisterScreen';
import { LinearGradient } from 'expo-linear-gradient';

const BACKGROUND_GRADIENT = ['#06150F', '#0C3025', '#0F8B63'] as const;

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const [login, setLogin] = useState(true);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const heroTitle = login
    ? 'Track your nutrition with more calm and clarity.'
    : 'Build a healthier routine that feels easy to keep.';
  const heroSubtitle = login
    ? 'Jump back into your meals, macros, and daily goals in a few taps.'
    : 'Create an account to save your progress, plan your meals, and stay consistent.';

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <LinearGradient
      colors={BACKGROUND_GRADIENT}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <StatusBar style="light" />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={insets.top}
        >
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            bounces={false}
            automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
            contentInsetAdjustmentBehavior={Platform.OS === "ios" ? "always" : "never"}
            keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: Math.max(
                insets.bottom + (keyboardVisible ? 140 : 32),
                keyboardVisible ? 140 : 32
              ),
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="px-6 pb-3 pt-4">
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  right: -28,
                  top: 12,
                  height: 170,
                  width: 170,
                  borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.10)',
                }}
              />
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: -42,
                  top: 150,
                  height: 120,
                  width: 120,
                  borderRadius: 999,
                  backgroundColor: 'rgba(122,255,216,0.14)',
                }}
              />

              <View>
                <View className="rounded-full border border-white/20 bg-white/10 self-start px-4 py-2">
                  <Text className="text-xs font-bold uppercase tracking-widest text-emerald-50">
                    Caloriee
                  </Text>
                </View>

                <Text
                  className="mt-5 text-white font-black"
                  style={{
                    fontSize: 34,
                    lineHeight: 40,
                  }}
                >
                  {heroTitle}
                </Text>

                {!keyboardVisible ? (
                  <Text
                    className="mt-4 text-emerald-50"
                    style={{ fontSize: 16, lineHeight: 24 }}
                  >
                    {heroSubtitle}
                  </Text>
                ) : null}

                {!keyboardVisible ? (
                  <View className="mt-5 flex-row flex-wrap">
                    <View className="mb-3 mr-3 rounded-full border border-white/15 bg-white/10 px-4 py-2">
                      <Text className="text-sm font-semibold text-white">Daily goals</Text>
                    </View>
                    <View className="mb-3 mr-3 rounded-full border border-white/15 bg-white/10 px-4 py-2">
                      <Text className="text-sm font-semibold text-white">Macro tracking</Text>
                    </View>
                    <View className="mb-3 rounded-full border border-white/15 bg-white/10 px-4 py-2">
                      <Text className="text-sm font-semibold text-white">Meal history</Text>
                    </View>
                  </View>
                ) : null}
              </View>

              <View className="mt-8 rounded-[30px] border border-white/10 px-4 py-4">
                <View className="flex-row rounded-full border border-white/10 bg-black/10 p-1">
                  <Pressable
                    onPress={() => setLogin(true)}
                    className={`flex-1 rounded-full px-4 py-3 ${login ? 'border border-white/15 bg-white' : ''}`}
                  >
                    <Text className={`text-center text-sm font-bold ${login ? 'text-secondary ' : 'text-emerald-50/75'}`}>
                      Sign In
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setLogin(false)}
                    className={`flex-1 rounded-full px-4 py-3 ${!login ? 'border border-white/15 bg-white' : ''}`}
                  >
                    <Text className={`text-center text-sm font-bold ${!login ? 'text-secondary' : 'text-emerald-50/75'}`}>
                      Register
                    </Text>
                  </Pressable>
                </View>

                <View className="mt-5">
                  {login ? (
                    <LoginScreen onSwitch={() => setLogin(false)} />
                  ) : (
                    <RegisterScreen onSwitch={() => setLogin(true)} />
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
