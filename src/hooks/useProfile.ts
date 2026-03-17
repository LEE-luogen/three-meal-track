import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Profile {
  id: string;
  user_id: string;
  nickname: string;
  avatar_url: string | null;
  phone: string | null;
  phone_verified: boolean;
  height_cm: number | null;
  gender: string | null;
  birth_date: string | null;
  activity_level: string | null;
  goal: string | null;
  is_pro: boolean;
  pro_expire_at: string | null;
  remaining_free_analyses: number;
  nickname_changed_count: number;
  onboarding_data: Record<string, unknown> | null;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) { setProfile(null); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    setProfile(data as Profile | null);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const updateProfile = useCallback(async (updates: Record<string, unknown>) => {
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase
      .from('profiles')
      .update(updates as any)
      .eq('user_id', user.id);
    if (!error) await fetchProfile();
    return { error: error?.message ?? null };
  }, [user, fetchProfile]);

  const decrementFreeAnalyses = useCallback(async () => {
    if (!profile || profile.remaining_free_analyses <= 0) return false;
    await updateProfile({ remaining_free_analyses: profile.remaining_free_analyses - 1 });
    return true;
  }, [profile, updateProfile]);

  return { profile, loading, updateProfile, decrementFreeAnalyses, refetch: fetchProfile };
}
