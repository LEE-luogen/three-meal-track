import { create } from 'zustand';

export interface UserProfile {
  userId: string;
  nickname: string;
  avatarDataUrl: string | null;
  phone: string | null;
  phoneVerified: boolean;
  hasPassword: boolean;
  isPro: boolean;
  proExpireAt: number | null;
  createdAt: string;
  lastLoginAt: string | null;
  nicknameChangedCount: number;
  nicknameLastChangedAt: number | null;
  remainingFreeAnalyses: number;
}

export interface UserStats {
  badgesUnlocked: string[];
  mealCostSetting: number;
  initialWeight: number | null;
  currentWeight: number | null;
  actualAge: number | null;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  remainingText: string;
  description: string;
}

interface UserStore {
  // User profile
  userProfile: UserProfile;
  userStats: UserStats;
  authToken: string | null;
  subscriptionType: 'free' | 'pro';
  
  // UI state
  showCamera: boolean;
  showPaywall: boolean;
  showSettings: boolean;
  showEditProfile: boolean;
  showPrivacy: boolean;
  showClearDataConfirm: boolean;
  showContact: boolean;
  
  // Actions
  setShowCamera: (show: boolean) => void;
  setShowPaywall: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
  setShowEditProfile: (show: boolean) => void;
  setShowPrivacy: (show: boolean) => void;
  setShowClearDataConfirm: (show: boolean) => void;
  setShowContact: (show: boolean) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  resetAll: () => void;
}

const defaultProfile: UserProfile = {
  userId: 'user_001',
  nickname: '',
  avatarDataUrl: null,
  phone: null,
  phoneVerified: false,
  hasPassword: false,
  isPro: false,
  proExpireAt: null,
  createdAt: new Date().toISOString(),
  lastLoginAt: null,
  nicknameChangedCount: 0,
  nicknameLastChangedAt: null,
  remainingFreeAnalyses: 3,
};

const defaultStats: UserStats = {
  badgesUnlocked: ['first_meal', 'week_streak'],
  mealCostSetting: 30,
  initialWeight: null,
  currentWeight: null,
  actualAge: null,
};

export const useUserStore = create<UserStore>((set) => ({
  userProfile: defaultProfile,
  userStats: defaultStats,
  authToken: null,
  subscriptionType: 'free',
  
  showCamera: false,
  showPaywall: false,
  showSettings: false,
  showEditProfile: false,
  showPrivacy: false,
  showClearDataConfirm: false,
  showContact: false,
  
  setShowCamera: (show) => set({ showCamera: show }),
  setShowPaywall: (show) => set({ showPaywall: show }),
  setShowSettings: (show) => set({ showSettings: show }),
  setShowEditProfile: (show) => set({ showEditProfile: show }),
  setShowPrivacy: (show) => set({ showPrivacy: show }),
  setShowClearDataConfirm: (show) => set({ showClearDataConfirm: show }),
  setShowContact: (show) => set({ showContact: show }),
  
  updateUserProfile: (updates) => set((state) => ({
    userProfile: { ...state.userProfile, ...updates }
  })),
  
  resetAll: () => set({
    userProfile: defaultProfile,
    userStats: defaultStats,
    authToken: null,
  }),
}));

// Build badges based on stats
export const buildBadges = (stats: UserStats): Badge[] => {
  const allBadges: Badge[] = [
    {
      id: 'first_meal',
      name: '初次记录',
      icon: '🍽️',
      unlocked: false,
      remainingText: '记录第一餐',
      description: '完成第一次饮食记录',
    },
    {
      id: 'week_streak',
      name: '坚持一周',
      icon: '🔥',
      unlocked: false,
      remainingText: '连续记录7天',
      description: '连续7天完成饮食记录',
    },
    {
      id: 'fasting_master',
      name: '断食达人',
      icon: '⏰',
      unlocked: false,
      remainingText: '完成10次断食',
      description: '成功完成10次断食计划',
    },
    {
      id: 'calorie_control',
      name: '热量管家',
      icon: '📊',
      unlocked: false,
      remainingText: '控制热量30天',
      description: '连续30天保持热量目标',
    },
    {
      id: 'early_bird',
      name: '早起达人',
      icon: '🌅',
      unlocked: false,
      remainingText: '7点前记录早餐',
      description: '连续7天在7点前记录早餐',
    },
    {
      id: 'weight_goal',
      name: '目标达成',
      icon: '🎯',
      unlocked: false,
      remainingText: '达成体重目标',
      description: '成功达成设定的体重目标',
    },
  ];

  return allBadges.map(badge => ({
    ...badge,
    unlocked: stats.badgesUnlocked.includes(badge.id),
  }));
};
