import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboard";

export default function Index() {
  const router = useRouter();
  const { loading: authLoading, session } = useAuth();
  const { loadingOnboard, seen } = useOnboarding();

  const loading = authLoading || loadingOnboard;

  useEffect(() => {
    if (loading) return;

    // 1) First-ever launch -> onboarding route
    if (seen === false) {
      router.replace("/Onboarding");
      return;
    }

    // 2) Already onboarded + logged in -> Home
    if (session) {
      router.replace("/(tabs)/home");
      return;
    }

    // 3) Already onboarded + not logged in -> Auth flow
    router.replace("/(auth)/AuthScreen");
  }, [loading, seen, session, router]);

  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#0e3a02ff" />
    </View>
  );
}
