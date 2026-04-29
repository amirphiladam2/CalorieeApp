import AppNotificationManager from "@/components/AppNotificationManager";
import { store } from "@/store";
import {
    Feather,
    FontAwesome,
    Foundation,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import "expo-dev-client";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Provider } from "react-redux";
import "./global.css";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...Feather.font,
    ...FontAwesome.font,
    ...Foundation.font,
    ...Ionicons.font,
    ...MaterialCommunityIcons.font,
    ...MaterialIcons.font,
    ...SimpleLineIcons.font,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Provider store={store}>
      <AppNotificationManager />
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
}
