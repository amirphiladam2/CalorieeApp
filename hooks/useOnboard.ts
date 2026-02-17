import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const ONBOARD_KEY = "seenOnboard_v1";

export function useOnboarding() {
  
  const [loadingOnboard, setLoadingOnboard] = useState(true);
  const [seen, setSeen] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(ONBOARD_KEY)
      .then((v) => {
        if (!mounted) return;
        setSeen(v === "true");
      })
      .catch(() => {
        if (mounted) setSeen(false);
      })
      .finally(() => {
        if (mounted) setLoadingOnboard(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARD_KEY, "true");
    setSeen(true);
  };

  return { loadingOnboard, seen, completeOnboarding };
}
