import React from "react";
import { useRouter } from "expo-router";
import OnboardScreen from "@/components/OnboardScreen";
import { useOnboarding } from "@/hooks/useOnboard";

export default function OnboardingRoute() {
  const router = useRouter();
  const { completeOnboarding } = useOnboarding();

  const finish = async () => {
    await completeOnboarding();
    router.replace("/(auth)/AuthScreen"); 
  };

  return <OnboardScreen onDone={finish} />;
}
