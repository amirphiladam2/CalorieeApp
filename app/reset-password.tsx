import { InputField } from "@/components/AuthForms/InputField";
import { CustomButton } from "@/components/Buttons/CustomButton";
import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

const BACKGROUND_GRADIENT = ["#06150F", "#0C3025", "#0F8B63"] as const;

type RecoveryParams = {
  accessToken: string | null;
  refreshToken: string | null;
  code: string | null;
};

const parseRecoveryUrl = (url: string): RecoveryParams => {
  const [base, fragment = ""] = url.split("#");
  const baseParams = new URL(base).searchParams;
  const fragmentParams = new URLSearchParams(fragment);

  return {
    accessToken:
      fragmentParams.get("access_token") ?? baseParams.get("access_token"),
    refreshToken:
      fragmentParams.get("refresh_token") ?? baseParams.get("refresh_token"),
    code: baseParams.get("code") ?? fragmentParams.get("code"),
  };
};

export default function ResetPasswordScreen() {
  const router = useRouter();
  const url = Linking.useURL();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [linkError, setLinkError] = useState("");
  const [linkReady, setLinkReady] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);
  const [saving, setSaving] = useState(false);

  const recoveryParams = useMemo(
    () => (url ? parseRecoveryUrl(url) : null),
    [url]
  );

  useEffect(() => {
    let mounted = true;

    const prepareRecoverySession = async () => {
      setCheckingLink(true);
      setLinkError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session) {
        setLinkReady(true);
        setCheckingLink(false);
        return;
      }

      if (!recoveryParams) {
        setLinkReady(false);
        setLinkError(
          "Open this screen from the password reset email so the app receives your recovery link."
        );
        setCheckingLink(false);
        return;
      }

      try {
        if (recoveryParams.code) {
          const { error } = await supabase.auth.exchangeCodeForSession(
            recoveryParams.code
          );

          if (error) throw error;
        } else if (recoveryParams.accessToken && recoveryParams.refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: recoveryParams.accessToken,
            refresh_token: recoveryParams.refreshToken,
          });

          if (error) throw error;
        } else {
          throw new Error("Recovery link is missing tokens.");
        }

        if (!mounted) return;
        setLinkReady(true);
      } catch (error) {
        if (!mounted) return;
        setLinkReady(false);
        setLinkError(
          error instanceof Error
            ? error.message
            : "We could not read that password reset link."
        );
      } finally {
        if (mounted) {
          setCheckingLink(false);
        }
      }
    };

    prepareRecoverySession();

    return () => {
      mounted = false;
    };
  }, [recoveryParams]);

  const handleUpdatePassword = async () => {
    let hasError = false;

    setPasswordError("");
    setConfirmPasswordError("");

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      hasError = true;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      hasError = true;
    }

    if (hasError) return;

    try {
      setSaving(true);

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        Alert.alert("Reset failed", error.message);
        return;
      }

      Alert.alert("Password updated", "Your password has been updated successfully.", [
        {
          text: "Continue",
          onPress: () => router.replace("/(tabs)/home"),
        },
      ]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <LinearGradient
      colors={BACKGROUND_GRADIENT}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          >
            <TouchableOpacity
              onPress={() => router.replace("/(auth)/AuthScreen")}
              activeOpacity={0.8}
              className="h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10"
            >
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <View className="mt-8">
              <Text className="text-[12px] font-semibold uppercase tracking-[1.5px] text-emerald-50/75">
                Recovery
              </Text>
              <Text className="mt-2 text-[30px] font-black text-white">
                Reset your password
              </Text>
              <Text className="mt-3 text-sm leading-6 text-emerald-50/75">
                Open the link from your recovery email on this device, then choose a new password below.
              </Text>
            </View>

            <View className="mt-8 rounded-[30px] border border-white/10 bg-black/10 p-5">
              {checkingLink ? (
                <Text className="text-sm leading-6 text-emerald-50/75">
                  Verifying your recovery link...
                </Text>
              ) : linkReady ? (
                <>
                  <InputField
                    icon="lock-closed-outline"
                    label="New Password"
                    placeholder="Create a new password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    error={passwordError}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="newPassword"
                    variant="auth"
                  />

                  <InputField
                    icon="shield-checkmark-outline"
                    label="Confirm Password"
                    placeholder="Confirm your new password"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    error={confirmPasswordError}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="newPassword"
                    variant="auth"
                  />

                  <View className="mt-4">
                    <CustomButton
                      title="Update Password"
                      onPress={handleUpdatePassword}
                      disabled={saving}
                      loading={saving}
                      loadingText="Updating..."
                      backgroundColor="white"
                      textColor="#02422e"
                    />
                  </View>
                </>
              ) : (
                <>
                  <View className="rounded-[24px] border border-red-200 bg-red-50 px-4 py-4">
                    <Text className="text-sm font-semibold text-red-700">
                      Recovery link issue
                    </Text>
                    <Text className="mt-2 text-sm leading-6 text-red-600">
                      {linkError}
                    </Text>
                  </View>

                  <View className="mt-4">
                    <CustomButton
                      title="Back to Sign In"
                      onPress={() => router.replace("/(auth)/AuthScreen")}
                      backgroundColor="white"
                      textColor="#02422e"
                    />
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
