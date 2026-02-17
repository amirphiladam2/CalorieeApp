import ProfileCard from "@/components/Settings/ProfileCard";
import { useProfile } from "@/hooks/useProfile";
import { getProfileStats, updateProfileAvatar, uploadAvatar } from "@/services/profileService";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";

export default function ProfileScreen() {
  const { profile, loading, refetch } = useProfile();

  const [localAvatar, setLocalAvatar] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({ mealsLogged: 0, dayStreak: 0 });

  const fullName = profile?.full_name ?? "User";
  const displayUsername = profile?.username ?? profile?.email ?? "";
  const avatarUrl = localAvatar ?? profile?.avatar_url ?? undefined;

  // Request media library permissions
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to upload profile pictures!"
        );
      }
    })();
  }, []);

  useEffect(() => {
    if (profile?.id) {
      loadStats();
    }
  }, [profile?.id]);

  const loadStats = async () => {
    if (!profile) return;
    try {
      const data = await getProfileStats(profile.id);
      setStats({ mealsLogged: data.meals_logged, dayStreak: data.day_streak });
    } catch (e) {
      console.error("Failed to load stats", e);
    }
  }

  const handlePickAvatar = async () => {
    if (!profile) return;

    // Check permissions
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant media library permissions to upload profile pictures."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    try {
      setUploading(true);

      const uri = result.assets[0].uri;
      setLocalAvatar(uri);

      const avatarUrl = await uploadAvatar(profile.id, uri);
      await updateProfileAvatar(profile.id, avatarUrl);

      await refetch();
    } catch (err) {
      console.error("Avatar upload failed:", err);
      Alert.alert("Upload Failed", "Failed to upload profile picture. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View>
      <ProfileCard
        full_Name={fullName}
        username={displayUsername}
        avatarUrl={avatarUrl}
        day_streak={stats.dayStreak}
        meals_logged={stats.mealsLogged}
        onPressAvatar={uploading ? () => { } : handlePickAvatar}
      />
    </View>
  );
}
