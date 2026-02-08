import { create } from 'zustand';

interface FastingState {
  // UI 状态
  showFastingComplete: boolean;
  showEarlyEndConfirm: boolean;
  
  // 断食数据
  isFasting: boolean;
  fastingStartTime: number | null;
  targetHours: number;
  planType: string;
  
  // 最近完成的断食记录
  lastCompletedFasting: {
    hours: number;
    minutes: number;
    completionRate: number;
    endReason?: string;
  } | null;
  
  // 新解锁的勋章
  newBadge: { id: string; name: string; icon: string } | null;
  
  // Actions
  setShowFastingComplete: (show: boolean) => void;
  setShowEarlyEndConfirm: (show: boolean) => void;
  startFasting: () => void;
  endFasting: (reason?: string) => void;
  setTargetHours: (hours: number) => void;
  setPlanType: (plan: string) => void;
  clearNewBadge: () => void;
}

export const useFastingStore = create<FastingState>((set, get) => ({
  // 初始状态
  showFastingComplete: false,
  showEarlyEndConfirm: false,
  isFasting: true,
  fastingStartTime: Date.now(),
  targetHours: 16,
  planType: '16:8',
  lastCompletedFasting: null,
  newBadge: null,
  
  // Actions
  setShowFastingComplete: (show) => set({ showFastingComplete: show }),
  setShowEarlyEndConfirm: (show) => set({ showEarlyEndConfirm: show }),
  
  startFasting: () => set({
    isFasting: true,
    fastingStartTime: Date.now(),
    lastCompletedFasting: null,
    newBadge: null,
  }),
  
  endFasting: (reason) => {
    const { fastingStartTime, targetHours } = get();
    if (!fastingStartTime) return;
    
    const elapsed = Date.now() - fastingStartTime;
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const totalMinutes = hours * 60 + minutes;
    const targetMinutes = targetHours * 60;
    const completionRate = Math.min(100, Math.round((totalMinutes / targetMinutes) * 100));
    
    // 检查是否解锁新勋章（示例逻辑）
    let newBadge = null;
    if (completionRate >= 100) {
      // 这里可以添加更复杂的勋章解锁逻辑
      newBadge = { id: 'week_streak', name: '坚持一周', icon: '🏆' };
    }
    
    set({
      isFasting: false,
      fastingStartTime: null,
      lastCompletedFasting: {
        hours,
        minutes,
        completionRate,
        endReason: reason,
      },
      newBadge,
      showFastingComplete: false,
      showEarlyEndConfirm: false,
    });
  },
  
  setTargetHours: (hours) => set({ targetHours: hours }),
  setPlanType: (plan) => set({ planType: plan }),
  clearNewBadge: () => set({ newBadge: null }),
}));
