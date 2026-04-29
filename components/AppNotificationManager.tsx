import { useAuth } from "@/hooks/useAuth";
import {
  ensureMealRemindersScheduledAsync,
  getNotificationRedirectUrl,
  getStoredNotificationPreferences,
  registerForPushNotificationsAsync,
} from "@/services/notifications";
import { updateProfile } from "@/services/profileService";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect } from "react";

export default function AppNotificationManager() {
  const { user } = useAuth();

  useEffect(() => {
    const redirectFromNotification = (notification: Notifications.Notification) => {
      const nextUrl = getNotificationRedirectUrl(notification);

      if (nextUrl) {
        router.push(nextUrl);
      }
    };

    const initialResponse = Notifications.getLastNotificationResponse();

    if (initialResponse?.notification) {
      redirectFromNotification(initialResponse.notification);
    }

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        redirectFromNotification(response.notification);
      });

    return () => {
      responseSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    let active = true;

    const syncNotifications = async () => {
      try {
        const preferences = await getStoredNotificationPreferences();

        if (preferences.mealReminders) {
          await ensureMealRemindersScheduledAsync();
        }

        if (preferences.pushNotifications) {
          const expoPushToken = await registerForPushNotificationsAsync();

          if (active) {
            await updateProfile(user.id, {
              expo_push_token: expoPushToken,
              push_notifications_enabled: true,
            });
          }
        }
      } catch (error) {
        console.warn("Notification bootstrap failed:", error);
      }
    };

    void syncNotifications();

    const tokenSubscription = Notifications.addPushTokenListener((token) => {
      void (async () => {
        const preferences = await getStoredNotificationPreferences();

        if (!preferences.pushNotifications) {
          return;
        }

        await updateProfile(user.id, {
          expo_push_token: token.data,
          push_notifications_enabled: true,
        });
      })();
    });

    return () => {
      active = false;
      tokenSubscription.remove();
    };
  }, [user]);

  return null;
}
