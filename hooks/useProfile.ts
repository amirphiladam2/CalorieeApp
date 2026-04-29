import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

export type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  calorie_goal: number | null;
  weight_goal: number | null;
  protein_goal?: number | null;
  carbs_goal?: number | null;
  fats_goal?: number | null;
  expo_push_token: string | null;
  push_notifications_enabled: boolean | null;
  meal_reminders_enabled: boolean | null;
};

export function useProfile() {
  const { user } = useAuth();
  const isMountedRef = useRef(true);
  const loadedUserIdRef = useRef<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      if (isMountedRef.current) {
        loadedUserIdRef.current = null;
        setProfile(null);
        setLoading(false);
      }
      return;
    }

    const isInitialLoad = loadedUserIdRef.current !== user.id;

    if (isMountedRef.current && isInitialLoad) {
      setLoading(true);
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!isMountedRef.current) {
      return;
    }

    if (error || !data) {
      setLoading(false);
      return;
    }

    setProfile(data);
    loadedUserIdRef.current = user.id;

    const meta = user.user_metadata;
    const updates: Partial<Profile> = {};

    if (!data.full_name) {
      updates.full_name =
        meta?.full_name ??
        meta?.name ??
        meta?.display_name ??
        null;
    }

    if (!data.avatar_url) {
      updates.avatar_url =
        meta?.picture ??
        meta?.avatar_url ??
        null;
    }

    if (!data.email) {
      updates.email = user.email ?? null;
    }

    if (Object.keys(updates).length > 0) {
      const { data: updatedProfile } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();

      if (!isMountedRef.current) {
        return;
      }

      if (updatedProfile) {
        setProfile(updatedProfile);
        loadedUserIdRef.current = user.id;
      }
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  
  return { profile, loading, refetch: fetchProfile };
}
