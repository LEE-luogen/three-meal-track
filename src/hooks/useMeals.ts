import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Meal {
  id: string;
  user_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  photo_url: string | null;
  note: string | null;
  eaten_at: string;
  ai_recognized: boolean;
  ai_confidence: number | null;
  tags: string[];
  created_at: string;
}

export function useMeals(date?: string) {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  const targetDate = date || new Date().toISOString().split('T')[0];

  const fetchMeals = useCallback(async () => {
    if (!user) { setMeals([]); setLoading(false); return; }
    setLoading(true);
    const startOfDay = `${targetDate}T00:00:00`;
    const endOfDay = `${targetDate}T23:59:59`;
    const { data } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user.id)
      .gte('eaten_at', startOfDay)
      .lte('eaten_at', endOfDay)
      .order('eaten_at', { ascending: true });
    setMeals((data as Meal[]) || []);
    setLoading(false);
  }, [user, targetDate]);

  useEffect(() => { fetchMeals(); }, [fetchMeals]);

  const addMeal = useCallback(async (meal: Omit<Meal, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase
      .from('meals')
      .insert({ ...meal, user_id: user.id });
    if (!error) await fetchMeals();
    return { error: error?.message ?? null };
  }, [user, fetchMeals]);

  const updateMeal = useCallback(async (id: string, updates: Partial<Meal>) => {
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase
      .from('meals')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id);
    if (!error) await fetchMeals();
    return { error: error?.message ?? null };
  }, [user, fetchMeals]);

  const deleteMeal = useCallback(async (id: string) => {
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (!error) await fetchMeals();
    return { error: error?.message ?? null };
  }, [user, fetchMeals]);

  const todayCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const todayProtein = meals.reduce((sum, m) => sum + (m.protein_g || 0), 0);
  const todayCarbs = meals.reduce((sum, m) => sum + (m.carbs_g || 0), 0);
  const todayFat = meals.reduce((sum, m) => sum + (m.fat_g || 0), 0);

  return {
    meals, loading, addMeal, updateMeal, deleteMeal, refetch: fetchMeals,
    todayCalories, todayProtein, todayCarbs, todayFat,
  };
}
