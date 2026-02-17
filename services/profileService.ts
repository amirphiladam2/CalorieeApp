import { supabase } from "@/lib/supabase";

import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';

export const uploadAvatar = async (
  userId: string,
  uri: string
): Promise<string> => {
  const fileExt = uri.split(".").pop()?.toLowerCase() ?? "jpg";
  const filePath = `${userId}/avatar.${fileExt}`;
  const contentType = fileExt === "png" ? "image/png" : "image/jpeg";

  // Read the file as a base64 string
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: 'base64',
  });

  // Convert base64 to ArrayBuffer
  const arrayBuffer = decode(base64);

  // Upload to Supabase storage
  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, arrayBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw error;
  }

  // Get the public URL
  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const updateProfileAvatar = async (
  userId: string,
  avatarurl: string,
): Promise<void> => {
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarurl })
    .eq("id", userId);

  if (error) throw error;
};

export const updateProfile = async (
  userId: string,
  updates: {
    full_name?: string;
    username?: string;
    calorie_goal?: number;
    weight_goal?: number;
  }
): Promise<void> => {
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  if (error) throw error;
};

export const getProfileStats = async (userId: string) => {
  // 1. Total Meals Logged
  const { count, error: countError } = await supabase
    .from("meals")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  
  if (countError) throw countError;

  // 2. Day Streak
  const { data, error: dateError } = await supabase
    .from("meals")
    .select("date")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (dateError) throw dateError;

  // Unique dates set
  const uniqueDates = Array.from(new Set(data.map((m) => m.date)));
  
  // Calculate streak
  let streak = 0;
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Check if we have logs for today or yesterday to start the streak
  if (!uniqueDates.includes(today) && !uniqueDates.includes(yesterday)) {
    return { meals_logged: count || 0, day_streak: 0 };
  }

  // Iterate to count consecutive days
  // We need to parse dates to correctly handle gaps
  // Sort descending just to be sure
  uniqueDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Recent date to check continuity
  let currentCheck = new Date();
  
  const todayStr = currentCheck.toISOString().split("T")[0];
  if (!uniqueDates.includes(todayStr)) {
      currentCheck.setDate(currentCheck.getDate() - 1);
  }

  // Simple loop
  for (let i = 0; i < uniqueDates.length; i++) {
     const dateStr = uniqueDates[i];
     const checkStr = currentCheck.toISOString().split("T")[0];

     if (dateStr === checkStr) {
        streak++;
        // Move check to previous day
        currentCheck.setDate(currentCheck.getDate() - 1);
     } else {
        if (new Date(dateStr) < new Date(checkStr)) {
            break;
        }
     }
  }

  return { meals_logged: count || 0, day_streak: streak };
};
