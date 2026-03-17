import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface WeightLog {
  id: string;
  weight_kg: number;
  logged_at: string;
  note: string | null;
}

export function useWeightLogs(limit = 30) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    if (!user) { setLogs([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('logged_at', { ascending: false })
      .limit(limit);
    setLogs((data as WeightLog[]) || []);
    setLoading(false);
  }, [user, limit]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const addWeight = useCallback(async (weightKg: number, note?: string) => {
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase
      .from('weight_logs')
      .insert({ user_id: user.id, weight_kg: weightKg, note: note || null });
    if (!error) await fetchLogs();
    return { error: error?.message ?? null };
  }, [user, fetchLogs]);

  const currentWeight = logs[0]?.weight_kg ?? null;
  const previousWeight = logs[1]?.weight_kg ?? null;
  const weightChange = currentWeight && previousWeight ? currentWeight - previousWeight : null;

  return { logs, loading, addWeight, currentWeight, weightChange, refetch: fetchLogs };
}
