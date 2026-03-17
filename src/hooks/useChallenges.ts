import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Challenge {
  id: string;
  title: string;
  description: string | null;
  challenge_type: string;
  target_value: number | null;
  target_unit: string | null;
  starts_at: string;
  ends_at: string;
  participants_count?: number;
  my_progress?: number;
  joined?: boolean;
}

export function useChallenges() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('challenges')
      .select('*, challenge_participants(user_id, progress)')
      .gte('ends_at', new Date().toISOString())
      .order('starts_at', { ascending: true });

    const mapped = (data || []).map((c: any) => {
      const participants = c.challenge_participants || [];
      const myParticipation = user ? participants.find((p: any) => p.user_id === user.id) : null;
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        challenge_type: c.challenge_type,
        target_value: c.target_value,
        target_unit: c.target_unit,
        starts_at: c.starts_at,
        ends_at: c.ends_at,
        participants_count: participants.length,
        my_progress: myParticipation?.progress ?? 0,
        joined: !!myParticipation,
      };
    });
    setChallenges(mapped);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchChallenges(); }, [fetchChallenges]);

  const joinChallenge = useCallback(async (challengeId: string) => {
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase.from('challenge_participants').insert({
      user_id: user.id,
      challenge_id: challengeId,
    });
    if (!error) await fetchChallenges();
    return { error: error?.message ?? null };
  }, [user, fetchChallenges]);

  return { challenges, loading, joinChallenge, refetch: fetchChallenges };
}
