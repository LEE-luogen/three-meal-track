import { useState } from "react";
import { HomeHeader } from "@/components/home/HomeHeader";
import { CircularProgress } from "@/components/fasting/CircularProgress";
import { PhaseIndicator } from "@/components/home/PhaseIndicator";
import { TimeInfoCards } from "@/components/home/TimeInfoCards";
import { TodayMealsOverview } from "@/components/home/TodayMealsOverview";
import { AIIntelligenceCard } from "@/components/home/AIIntelligenceCard";
import { DataCardsGrid } from "@/components/home/DataCardsGrid";
import { QuickActionBar } from "@/components/home/QuickActionBar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { DebugPanel } from "@/components/debug/DebugPanel";
import { HomeDialogs } from "@/components/home/HomeDialogs";
import { useFasting } from "@/hooks/useFasting";
import { useProfile } from "@/hooks/useProfile";
import { useNotifications } from "@/hooks/useNotifications";
import { useFastingStore } from "@/stores/fastingStore";
import { Square, Play } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type MealType = "breakfast" | "lunch" | "dinner";

const Index = () => {
  const [loadingMeal, setLoadingMeal] = useState<MealType | null>(null);
  const { setShowFastingComplete, setShowEarlyEndConfirm } = useFastingStore();
  const { profile } = useProfile();
  const { unreadCount } = useNotifications();
  const {
    isFasting,
    elapsed,
    targetHours,
    planType,
    startFasting,
    endFasting: endFastingDB,
    activeFasting,
  } = useFasting();

  const fastingHours = elapsed.hours;
  const fastingMinutes = elapsed.minutes;
  const fastingSeconds = elapsed.seconds;

  const startTime = activeFasting
    ? new Date(activeFasting.started_at).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
    : "--:--";
  const endTimeDate = activeFasting
    ? new Date(new Date(activeFasting.started_at).getTime() + targetHours * 3600000)
    : null;
  const endTime = endTimeDate
    ? endTimeDate.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  const startLabel = activeFasting
    ? `今天 ${startTime}`
    : "--";
  const endLabel = endTimeDate
    ? `${endTimeDate.toDateString() === new Date().toDateString() ? "今天" : "明天"} ${endTime}`
    : "--";

  const handleEndFasting = async () => {
    const totalMinutes = fastingHours * 60 + fastingMinutes;
    const targetMinutes = targetHours * 60;
    if (totalMinutes >= targetMinutes) {
      setShowFastingComplete(true);
    } else if (totalMinutes > 30) {
      setShowEarlyEndConfirm(true);
    } else {
      toast({ title: "断食时间过短", description: "断食需超过30分钟才会被记录" });
    }
  };

  const handleStartFasting = async () => {
    const { error } = await startFasting(planType, targetHours);
    if (!error) {
      toast({ title: "断食已开始", description: `${planType} 计划` });
    }
  };

  const displayName = profile?.nickname || "用户";
  const today = new Date();
  const dateLabel = today.toLocaleDateString("zh-CN", { weekday: "short", month: "numeric", day: "numeric" });

  return (
    <div className="min-h-screen bg-background pb-24 page-enter">
      <div className="h-12" />

      <div className="px-4 max-w-md mx-auto space-y-6">
        <HomeHeader userName={displayName.charAt(0)} dateLabel={dateLabel} unreadCount={unreadCount} />

        <div className="flex justify-center animate-card-appear">
          <div className={cn(isFasting && "animate-breathing")} style={{ animationDuration: "3s" }}>
            <CircularProgress
              currentHours={fastingHours}
              currentMinutes={fastingMinutes}
              currentSeconds={fastingSeconds}
              targetHours={targetHours}
              isInFastingWindow={isFasting}
            />
          </div>
        </div>

        <PhaseIndicator currentHours={fastingHours} />

        <TimeInfoCards startTime={startLabel} endTime={endLabel} />

        {isFasting ? (
          <button
            onClick={handleEndFasting}
            className={cn(
              "w-full py-4 rounded-2xl font-medium flex items-center justify-center gap-2",
              "bg-foreground text-background shadow-lg",
              "hover:opacity-90 transition-opacity press-scale"
            )}
          >
            <Square className="w-4 h-4" />
            结束断食
          </button>
        ) : (
          <button
            onClick={handleStartFasting}
            className={cn(
              "w-full py-4 rounded-2xl font-medium flex items-center justify-center gap-2",
              "bg-primary text-primary-foreground shadow-lg",
              "hover:opacity-90 transition-opacity press-scale"
            )}
          >
            <Play className="w-4 h-4" />
            开始断食
          </button>
        )}

        <TodayMealsOverview />
        <AIIntelligenceCard />
        <DataCardsGrid />
        <QuickActionBar />
      </div>

      <BottomNavigation />
      <HomeDialogs onMealLoading={setLoadingMeal} />
      <DebugPanel />
    </div>
  );
};

export default Index;
