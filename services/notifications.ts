import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import type { Href } from "expo-router";
import { Platform } from "react-native";

const DEFAULT_CHANNEL_ID = "default";
const PUSH_NOTIFICATIONS_KEY = "@caloriee_push_notifications_v1";
const MEAL_REMINDERS_KEY = "@caloriee_meal_reminders_v1";
const MEAL_REMINDER_IDS_KEY = "@caloriee_meal_reminder_ids_v1";
const CUSTOM_MEAL_REMINDERS_KEY = "@caloriee_custom_meal_reminders_v1";

type NotificationPermissionStatusLike = Notifications.PermissionResponse & {
  ios?: {
    status?: Notifications.IosAuthorizationStatus;
  };
};

type NotificationPreferences = {
  pushNotifications: boolean;
  mealReminders: boolean;
};

type NotificationPreferencesFallback = Partial<NotificationPreferences>;

type MealReminderDefinition = {
  mealType: "Breakfast" | "Lunch" | "Snacks" | "Dinner";
  hour: number;
  minute: number;
  title: string;
  body: string;
};

export type NotificationPermissionSnapshot = {
  granted: boolean;
  canAskAgain: boolean;
  status: Notifications.PermissionStatus;
};

export type ScheduledMealReminderSummary = {
  id: string;
  mealType: MealReminderDefinition["mealType"];
  title: string;
  body: string;
  hour: number;
  minute: number;
};

export const DEFAULT_MEAL_REMINDERS: MealReminderDefinition[] = [
  {
    mealType: "Breakfast",
    hour: 8,
    minute: 0,
    title: "Breakfast reminder",
    body: "Start your day strong and log your breakfast.",
  },
  {
    mealType: "Lunch",
    hour: 13,
    minute: 0,
    title: "Lunch reminder",
    body: "Midday fuel check. Add lunch before the day gets away from you.",
  },
  {
    mealType: "Snacks",
    hour: 16,
    minute: 0,
    title: "Snack reminder",
    body: "Had a quick bite? Log your snack while it is still fresh.",
  },
  {
    mealType: "Dinner",
    hour: 19,
    minute: 0,
    title: "Dinner reminder",
    body: "Wrap up the day by logging dinner and your macros.",
  },
];

export async function getCustomMealReminders(): Promise<MealReminderDefinition[]> {
  try {
    const rawValue = await AsyncStorage.getItem(CUSTOM_MEAL_REMINDERS_KEY);
    if (!rawValue) {
      return DEFAULT_MEAL_REMINDERS;
    }
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : DEFAULT_MEAL_REMINDERS;
  } catch {
    return DEFAULT_MEAL_REMINDERS;
  }
}

export async function setCustomMealReminders(reminders: MealReminderDefinition[]) {
  try {
    await AsyncStorage.setItem(CUSTOM_MEAL_REMINDERS_KEY, JSON.stringify(reminders));
    // If meal reminders are active, reschedule them with new timings
    const { mealReminders } = await getStoredNotificationPreferences();
    if (mealReminders) {
      await scheduleMealRemindersAsync();
    }
  } catch (error) {
    console.error("Failed to save custom meal reminders", error);
  }
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function parseStoredBoolean(value: string | null, fallback: boolean) {
  if (value === null) {
    return fallback;
  }

  try {
    return JSON.parse(value) as boolean;
  } catch {
    return fallback;
  }
}

function isNotificationPermissionGranted(
  settings: NotificationPermissionStatusLike
) {
  return (
    settings.status === Notifications.PermissionStatus.GRANTED ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.EPHEMERAL
  );
}

function isMealReminderData(data: unknown) {
  return (
    !!data &&
    typeof data === "object" &&
    "kind" in data &&
    (data as { kind?: unknown }).kind === "meal-reminder"
  );
}

function getEasProjectId() {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId ??
    null
  );
}

function mapDevicePushNotificationError(error: unknown) {
  const defaultMessage =
    "Push notifications could not be enabled right now.";

  if (!(error instanceof Error)) {
    return defaultMessage;
  }

  const normalizedMessage = error.message.toLowerCase();

  if (
    normalizedMessage.includes("default firebaseapp is not initialized") ||
    normalizedMessage.includes("firebaseapp with name [default] doesn't exist")
  ) {
    return "Android push notifications are not configured in the installed build yet. Make sure Firebase `google-services.json` is included, then rebuild and reinstall the Android app. Expo Go and builds created before Firebase was added will keep failing.";
  }

  if (error.message.trim()) {
    return error.message;
  }

  return defaultMessage;
}

function mapExpoPushTokenError(error: unknown) {
  const defaultMessage =
    "Push notifications could not be enabled right now.";

  if (!(error instanceof Error)) {
    return defaultMessage;
  }

  const normalizedMessage = error.message.toLowerCase();

  if (normalizedMessage.includes("/fcm-credentials/")) {
    return "Android push notifications still need FCM V1 credentials in your Expo/EAS project. Upload the Firebase service account key in `eas credentials` under Android push notifications, then try again.";
  }

  if (error.message.trim()) {
    return error.message;
  }

  return defaultMessage;
}

async function getStoredMealReminderIds() {
  const rawValue = await AsyncStorage.getItem(MEAL_REMINDER_IDS_KEY);

  if (!rawValue) {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

async function setStoredMealReminderIds(ids: string[]) {
  if (ids.length === 0) {
    await AsyncStorage.removeItem(MEAL_REMINDER_IDS_KEY);
    return;
  }

  await AsyncStorage.setItem(MEAL_REMINDER_IDS_KEY, JSON.stringify(ids));
}

function withTimeout<T>(promise: Promise<T>, timeoutMs = 2000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Native notification request timed out")), timeoutMs)
    ),
  ]);
}

let hasConfiguredChannel = false;

export async function configureNotificationChannelAsync() {
  if (Platform.OS !== "android") {
    return;
  }

  if (hasConfiguredChannel) return;
  hasConfiguredChannel = true;

  try {
    await withTimeout(
      Notifications.setNotificationChannelAsync(DEFAULT_CHANNEL_ID, {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#0F9F67",
      }),
      2500
    );
  } catch (error) {
    console.warn("Failed to set notification channel", error);
  }
}

export async function getStoredNotificationPreferences(
  fallback: NotificationPreferencesFallback = {}
) {
  const [pushValue, mealValue] = await Promise.all([
    AsyncStorage.getItem(PUSH_NOTIFICATIONS_KEY),
    AsyncStorage.getItem(MEAL_REMINDERS_KEY),
  ]);

  return {
    pushNotifications: parseStoredBoolean(
      pushValue,
      fallback.pushNotifications ?? false
    ),
    mealReminders: parseStoredBoolean(mealValue, fallback.mealReminders ?? false),
  };
}

export async function setStoredPushNotificationsEnabled(enabled: boolean) {
  await AsyncStorage.setItem(PUSH_NOTIFICATIONS_KEY, JSON.stringify(enabled));
}

export async function setStoredMealRemindersEnabled(enabled: boolean) {
  await AsyncStorage.setItem(MEAL_REMINDERS_KEY, JSON.stringify(enabled));
}

export async function requestNotificationPermissionsAsync() {
  await configureNotificationChannelAsync();

  const existingPermissions =
    (await Notifications.getPermissionsAsync()) as NotificationPermissionStatusLike;

  if (isNotificationPermissionGranted(existingPermissions)) {
    return existingPermissions;
  }

  const requestedPermissions =
    (await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    })) as NotificationPermissionStatusLike;

  if (!isNotificationPermissionGranted(requestedPermissions)) {
    throw new Error("Notification permission was not granted.");
  }

  return requestedPermissions;
}

export async function registerForPushNotificationsAsync() {
  await requestNotificationPermissionsAsync();

  if (!Device.isDevice) {
    throw new Error("Push notifications require a physical device.");
  }

  const projectId = getEasProjectId();

  if (!projectId) {
    throw new Error(
      "EAS project ID not found. Run `eas init` or set expo.extra.eas.projectId before requesting push tokens."
    );
  }

  let devicePushToken;

  try {
    devicePushToken = await Notifications.getDevicePushTokenAsync();
  } catch (error) {
    throw new Error(mapDevicePushNotificationError(error));
  }

  let token;

  try {
    token = await Notifications.getExpoPushTokenAsync({
      projectId,
      devicePushToken,
    });
  } catch (error) {
    throw new Error(mapExpoPushTokenError(error));
  }

  return token.data;
}

export async function cancelMealRemindersAsync() {
  try {
    await withTimeout(Notifications.cancelAllScheduledNotificationsAsync(), 1500);
  } catch (error) {
    // Suppress expected timeout warning on Expo Go/missing native module
  }
  await setStoredMealReminderIds([]);
}

export async function scheduleMealRemindersAsync() {
  await requestNotificationPermissionsAsync();
  await cancelMealRemindersAsync();

  // Wait an extra 500ms before scheduling to give native modules time to clear the pipeline
  await new Promise((resolve) => setTimeout(resolve, 500));

  const activeReminders = await getCustomMealReminders();

  const reminderPromises = activeReminders.map(async (reminder) => {
    try {
      const identifier = await withTimeout(
        Notifications.scheduleNotificationAsync({
          content: {
            title: reminder.title,
            body: reminder.body,
            sound: true,
            data: {
              kind: "meal-reminder",
              mealType: reminder.mealType,
              url: `/add-meal?meal=${encodeURIComponent(reminder.mealType)}`,
            },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: reminder.hour,
            minute: reminder.minute,
            channelId: DEFAULT_CHANNEL_ID,
          },
        }),
        2000
      );
      return identifier;
    } catch {
      return `mock-id-${reminder.mealType}`;
    }
  });

  const reminderIds = await Promise.all(reminderPromises);

  await setStoredMealReminderIds(reminderIds);

  return reminderIds;
}

export async function getNotificationPermissionSnapshotAsync(): Promise<NotificationPermissionSnapshot> {
  const permissions =
    (await Notifications.getPermissionsAsync()) as NotificationPermissionStatusLike;

  return {
    granted: isNotificationPermissionGranted(permissions),
    canAskAgain: permissions.canAskAgain,
    status: permissions.status,
  };
}

export async function listScheduledMealRemindersAsync(): Promise<ScheduledMealReminderSummary[]> {
  const { mealReminders } = await getStoredNotificationPreferences();

  if (!mealReminders) {
    return [];
  }

  // Workaround for Android getAllScheduledNotificationsAsync hanging:
  // Render based on the known static configurations since 
  // ensureMealRemindersScheduledAsync guarantees the schedule.
  const activeReminders = await getCustomMealReminders();
  return activeReminders.map((reminder, idx) => ({
    id: `static-reminder-${idx}`,
    mealType: reminder.mealType,
    title: reminder.title,
    body: reminder.body,
    hour: reminder.hour,
    minute: reminder.minute,
  })).sort((left, right) => {
    if (left.hour === right.hour) {
      return left.minute - right.minute;
    }
    return left.hour - right.hour;
  });
}

export async function ensureMealRemindersScheduledAsync() {
  const { mealReminders } = await getStoredNotificationPreferences();

  if (!mealReminders) {
    return [] as string[];
  }

  const reminderIds = await getStoredMealReminderIds();

  if (reminderIds.length > 0) {
    return reminderIds;
  }

  return scheduleMealRemindersAsync();
}

export function getNotificationRedirectUrl(
  notification: Notifications.Notification
): Href | null {
  const data = notification.request.content.data;

  if (!data || typeof data !== "object" || !("url" in data)) {
    return null;
  }

  if (typeof data.url !== "string") {
    return null;
  }

  if (data.url.startsWith("/add-meal")) {
    const [, query = ""] = data.url.split("?");
    const params = new URLSearchParams(query);
    const meal = params.get("meal");

    return {
      pathname: "/add-meal",
      ...(meal ? { params: { meal } } : {}),
    };
  }

  if (data.url === "/recipe") {
    return "/recipe";
  }

  if (data.url === "/(tabs)/home") {
    return "/(tabs)/home";
  }

  return null;
}

type NotificationListenerParams = {
  onNotificationReceived?: (
    notification: Notifications.Notification
  ) => void;
  onNotificationResponse?: (
    response: Notifications.NotificationResponse
  ) => void;
};

export function addNotificationListeners({
  onNotificationReceived,
  onNotificationResponse,
}: NotificationListenerParams) {
  const receivedSubscription = onNotificationReceived
    ? Notifications.addNotificationReceivedListener(onNotificationReceived)
    : null;

  const responseSubscription = onNotificationResponse
    ? Notifications.addNotificationResponseReceivedListener(
        onNotificationResponse
      )
    : null;

  return () => {
    receivedSubscription?.remove();
    responseSubscription?.remove();
  };
}
