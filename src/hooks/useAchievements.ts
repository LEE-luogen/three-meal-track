import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockCondition: string;
  unlocked: boolean;
  unlockedAt?: string;
}

const ALL_ACHIEVEMENTS = [
  { id: 'first_meal', name: '初次记录', icon: '🍽️', description: '完成第一次饮食记录', unlockCondition: '记录第一餐' },
  { id: 'week_streak', name: '坚持一周', icon: '🔥', description: '连续7天完成饮食记录', unlockCondition: '连续记录7天' },
  { id: 'fasting_master', name: '断食达人', icon: '⏰', description: '成功完成10次断食计划', unlockCondition: '完成10次断食' },
  { id: 'calorie_control', name: '热量管家', icon: '📊', description: '连续30天保持热量目标', unlockCondition: '控制热量30天' },
  { id: 'early_bird', name: '早起达人', icon: '🌅', description: '连续7天在7点前记录早餐', unlockCondition: '7点前记录早餐' },
  { id: 'weight_goal', name: '目标达成', icon: '🎯', description: '成功达成设定的体重目标', unlockCondition: '达成体重目标' },
  { id: 'first_fasting', name: '初次断食', icon: '🌟', description: '完成第一次断食', unlockCondition: '完成首次断食' },
  { id: 'iron_will', name: '铁人意志', icon: '🏆', description: '完成24小时断食', unlockCondition: '24h断食' },
  { id: 'social_star', name: '社交达人', icon: '🤝', description: '首次分享断食成果', unlockCondition: '首次分享' },
  { id: 'nutrition_expert', name: '营养专家', icon: '🥗', description: '连续7天营养评分>80', unlockCondition: '营养评分' },
  { id: 'hundred_days', name: '百日坚持', icon: '💎', description: '累计断食100天', unlockCondition: '累计100天' },
  { id: 'legend', name: '传说级别', icon: '🏅', description: '累计断食1000小时', unlockCondition: '累计1000h' },
];

export function useAchievements() {
  const { user } = useAuth();
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchAchievements = useCallback(async () => {
    if (!user) { setUnlockedIds(new Set()); setLoading(false); return; }
    const { data } = await supabase
      .from('user_achievements')
      .select('achievement_id, unlocked_at')
      .eq('user_id', user.id);
    setUnlockedIds(new Set((data || []).map(d => d.achievement_id)));
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchAchievements(); }, [fetchAchievements]);

  const unlockAchievement = useCallback(async (achievementId: string) => {
    if (!user || unlockedIds.has(achievementId)) return;
    await supabase.from('user_achievements').insert({ user_id: user.id, achievement_id: achievementId });
    await fetchAchievements();
  }, [user, unlockedIds, fetchAchievements]);

  const achievements: Achievement[] = ALL_ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: unlockedIds.has(a.id),
  }));

  const unlockedCount = unlockedIds.size;
  const totalCount = ALL_ACHIEVEMENTS.length;

  return { achievements, loading, unlockedCount, totalCount, unlockAchievement, refetch: fetchAchievements };
}
