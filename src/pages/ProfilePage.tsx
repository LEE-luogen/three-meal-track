import { Settings, ChevronRight, LogOut, Crown } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAchievements } from "@/hooks/useAchievements";
import { useWeightLogs } from "@/hooks/useWeightLogs";
import { useFasting } from "@/hooks/useFasting";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/stores/userStore";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { SettingsDrawer } from "@/components/modals/SettingsDrawer";
import { EditProfileModal } from "@/components/modals/EditProfileModal";
import { PrivacyModal } from "@/components/modals/PrivacyModal";
import { ClearDataModal } from "@/components/modals/ClearDataModal";
import { ContactModal } from "@/components/modals/ContactModal";
import { PaywallModal } from "@/components/modals/PaywallModal";
import { CameraModal } from "@/components/modals/CameraModal";
import { WeightCurveCard } from "@/components/fasting/WeightCurveCard";
import { toast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { achievements, unlockedCount } = useAchievements();
  const { currentWeight, addWeight } = useWeightLogs();
  const { totalFastingHours, completedCount } = useFasting();
  const { signOut } = useAuth();
  const { setShowSettings, setShowEditProfile, subscriptionType } = useUserStore();

  const displayName = profile?.nickname || "Flux 用户";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const isPro = profile?.is_pro ?? false;

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "已退出登录" });
  };

  // Estimated savings (skip meals * cost)
  const mealCost = 30;
  const savedMoney = completedCount * mealCost;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="h-12" />
      <div className="px-4 max-w-md mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">个人中心</h1>
          <button onClick={() => setShowSettings(true)}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center transition-colors hover:bg-secondary/80">
            <Settings className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* User card */}
        <div className="bg-card p-5 rounded-3xl shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full ring-4 ring-primary/10 bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xl font-semibold">
              {avatarInitial}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-foreground truncate">{displayName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${
                  isPro ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}>
                  {isPro ? "Pro" : "Free Plan"}
                </span>
              </div>
            </div>
            <button onClick={() => setShowEditProfile(true)}
              className="px-4 py-2 rounded-full bg-secondary text-sm font-medium text-foreground transition-colors hover:bg-secondary/80">
              编辑
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-card p-5 rounded-3xl shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground">勋章墙</h3>
            <button className="flex items-center gap-1 text-sm text-primary font-medium">
              全部 ({achievements.length})
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {achievements.slice(0, 6).map((badge) => (
              <div key={badge.id}
                className={`flex-shrink-0 w-24 p-3 rounded-2xl text-center transition-all ${
                  badge.unlocked ? "bg-primary/10" : "bg-muted/50 opacity-60"
                }`}>
                <div className="text-3xl mb-2">{badge.icon}</div>
                <p className={`text-xs font-medium truncate ${badge.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                  {badge.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats dashboard */}
        <div className="bg-card p-5 rounded-3xl shadow-card bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
            <p className="text-xs text-muted-foreground">身心能量仪表盘</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-card">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <span>✨</span><span>细胞净化</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {totalFastingHours > 16 ? `${Math.round(totalFastingHours - completedCount * 16)}` : "0"}分钟
              </p>
              <p className="text-xs text-muted-foreground mt-1">超过16h的部分累计</p>
            </div>
            <div className="p-4 rounded-2xl bg-card">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <span>⏰</span><span>胰脏休假</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{Math.round(totalFastingHours)}小时</p>
              <p className="text-xs text-muted-foreground mt-1">累计断食时长</p>
            </div>
            <div className="p-4 rounded-2xl bg-card">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <span>💰</span><span>财富积累</span>
              </div>
              <p className="text-2xl font-bold text-foreground">¥{savedMoney}</p>
              <p className="text-xs text-muted-foreground mt-1">单餐 ¥{mealCost}</p>
            </div>
            <div className="p-4 rounded-2xl bg-card">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <span>⚖️</span><span>当前体重</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{currentWeight ? `${currentWeight}kg` : "--"}</p>
              <p className="text-xs text-muted-foreground mt-1">{currentWeight ? "最近记录" : "暂未记录"}</p>
            </div>
          </div>
        </div>

        {/* Weight chart */}
        <WeightCurveCard onAddWeight={(weight) => {
          addWeight(weight);
          toast({ title: "体重已记录", description: `${weight} kg` });
        }} />

        {/* Sign out */}
        <button onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-card shadow-card text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors press-scale">
          <LogOut className="w-4 h-4" />
          退出登录
        </button>
      </div>

      <BottomNavigation />
      <SettingsDrawer />
      <EditProfileModal />
      <PrivacyModal />
      <ClearDataModal />
      <ContactModal />
      <PaywallModal />
      <CameraModal />
    </div>
  );
};

export default ProfilePage;
