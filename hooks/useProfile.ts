import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";

export type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  calorie_goal: number | null;
  weight_goal: number | null;
};

export function useProfile() {
  const { user } = useAuth();
 
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error || !data) {
      setLoading(false);
      return;
    }

    setProfile(data);

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

      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  
  return { profile, loading, refetch: fetchProfile };
}
