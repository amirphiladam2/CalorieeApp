import { defaultImage } from "@/constants/defaultImage";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type ProfileCardProps = {
  full_Name: string;
  username: string;
  day_streak: number;
  meals_logged: number;
  avatarUrl?: string;
  onPressAvatar: () => void;
};

export default function ProfileCard({
  full_Name,
  username,
  avatarUrl,
  onPressAvatar,
  day_streak,
  meals_logged,
}: ProfileCardProps) {
  const { profilepic } = defaultImage;

  return (
    <View className="mt-2 overflow-hidden rounded-[30px] bg-[#032E16] p-5 shadow-sm">
      <View className="flex-row items-start">
        <View className="h-20 w-20 overflow-hidden rounded-full border border-white/15 bg-white/10">
          <Image
            source={avatarUrl ? { uri: avatarUrl } : profilepic}
            resizeMode="cover"
            className="h-full w-full"
          />
        </View>

        <View className="ml-4 flex-1 pr-3">
          <Text className="text-[11px] font-semibold uppercase tracking-[1.2px] text-emerald-100/80">
            Wellness Profile
          </Text>
          <Text className="mt-2 text-[24px] font-black text-white">
            {full_Name}
          </Text>
          <Text className="mt-1 text-sm text-emerald-50/75">
            {username}
          </Text>
          <Text className="mt-2 text-xs leading-5 text-emerald-50/60">
            Keep your profile photo and goals up to date for a cleaner dashboard.
          </Text>
        </View>

        <TouchableOpacity
          onPress={onPressAvatar}
          activeOpacity={0.8}
          className="h-11 w-11 items-center justify-center rounded-full bg-white/10"
        >
          <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View className="mt-5 flex-row">
        <View className="mr-3 flex-1 rounded-[22px] bg-white/10 p-4">
          <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-emerald-50/70">
            Day Streak
          </Text>
          <Text className="mt-2 text-[24px] font-black text-white">
            {day_streak}
          </Text>
          <Text className="mt-1 text-xs text-emerald-50/65">
            Consistent logging
          </Text>
        </View>

        <View className="flex-1 rounded-[22px] bg-white/10 p-4">
          <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-emerald-50/70">
            Meals Logged
          </Text>
          <Text className="mt-2 text-[24px] font-black text-white">
            {meals_logged}
          </Text>
          <Text className="mt-1 text-xs text-emerald-50/65">
            Total entries
          </Text>
        </View>
      </View>
    </View>
  );
}
