import { Stack, useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { ActivityIndicator, View } from "react-native";
import { useEffect } from "react";

export default function AuthLayout() {
  const { loading, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) {
      router.replace("/(tabs)/home");
    }
  }, [loading, session]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#08b576ff" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
