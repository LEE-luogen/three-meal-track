import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface FastingRecord {
  id: string;
  user_id: string;
  plan_type: string;
  target_hours: number;
  started_at: string;
  ended_at: string | null;
  actual_hours: number | null;
  completion_rate: number | null;
  end_reason: string | null;
  is_active: boolean;
}

export function useFasting() {
  const { user } = useAuth();
  const [activeFasting, setActiveFasting] = useState<FastingRecord | null>(null);
  const [history, setHistory] = useState<FastingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchActive = useCallback(async () => {
    if (!user) { setActiveFasting(null); setLoading(false); return; }
    const { data } = await supabase
      .from('fasting_records')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle();
    setActiveFasting(data as FastingRecord | null);
    setLoading(false);
  }, [user]);

  const fetchHistory = useCallback(async (limit = 30) => {
    if (!user) { setHistory([]); return; }
    const { data } = await supabase
      .from('fasting_records')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', false)
      .order('started_at', { ascending: false })
      .limit(limit);
    setHistory((data as FastingRecord[]) || []);
  }, [user]);

  useEffect(() => { fetchActive(); fetchHistory(); }, [fetchActive, fetchHistory]);

  // Live timer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!activeFasting) { setElapsed({ hours: 0, minutes: 0, seconds: 0 }); return; }

    const update = () => {
      const start = new Date(activeFasting.started_at).getTime();
      const diff = Date.now() - start;
      setElapsed({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    timerRef.current = setInterval(update, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeFasting]);

  const startFasting = useCallback(async (planType = '16:8', targetHours = 16) => {
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase
      .from('fasting_records')
      .insert({
        user_id: user.id,
        plan_type: planType,
        target_hours: targetHours,
        started_at: new Date().toISOString(),
        is_active: true,
      });
    if (!error) await fetchActive();
    return { error: error?.message ?? null };
  }, [user, fetchActive]);

  const endFasting = useCallback(async (reason?: string) => {
    if (!user || !activeFasting) return { error: 'No active fasting' };
    const now = new Date();
    const start = new Date(activeFasting.started_at);
    const actualHours = (now.getTime() - start.getTime()) / 3600000;
    const completionRate = Math.min(100, Math.round((actualHours / activeFasting.target_hours) * 100));

    const { error } = await supabase
      .from('fasting_records')
      .update({
        ended_at: now.toISOString(),
        actual_hours: Math.round(actualHours * 100) / 100,
        completion_rate: completionRate,
        end_reason: reason || null,
        is_active: false,
      })
      .eq('id', activeFasting.id);
    if (!error) { await fetchActive(); await fetchHistory(); }
    return { error: error?.message ?? null, actualHours, completionRate };
  }, [user, activeFasting, fetchActive, fetchHistory]);

  const addManualRecord = useCallback(async (startTime: Date, endTime: Date, planType = '16:8', targetHours = 16) => {
    if (!user) return { error: 'Not authenticated' };
    const actualHours = (endTime.getTime() - startTime.getTime()) / 3600000;
    const completionRate = Math.min(100, Math.round((actualHours / targetHours) * 100));
    const { error } = await supabase
      .from('fasting_records')
      .insert({
        user_id: user.id,
        plan_type: planType,
        target_hours: targetHours,
        started_at: startTime.toISOString(),
        ended_at: endTime.toISOString(),
        actual_hours: Math.round(actualHours * 100) / 100,
        completion_rate: completionRate,
        is_active: false,
      });
    if (!error) await fetchHistory();
    return { error: error?.message ?? null };
  }, [user, fetchHistory]);

  // Stats
  const totalFastingHours = history.reduce((sum, r) => sum + (r.actual_hours || 0), 0);
  const completedCount = history.filter(r => (r.completion_rate || 0) >= 100).length;
  const streakDays = (() => {
    let streak = 0;
    const sorted = [...history].sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
    const today = new Date();
    for (let i = 0; i < sorted.length; i++) {
      const d = new Date(sorted[i].started_at);
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      if (d.toDateString() === expected.toDateString() && (sorted[i].completion_rate || 0) >= 100) {
        streak++;
      } else break;
    }
    return streak;
  })();

  return {
    activeFasting, history, loading, elapsed,
    startFasting, endFasting, addManualRecord,
    totalFastingHours, completedCount, streakDays,
    refetch: () => { fetchActive(); fetchHistory(); },
    isFasting: !!activeFasting,
    targetHours: activeFasting?.target_hours || 16,
    planType: activeFasting?.plan_type || '16:8',
  };
}
