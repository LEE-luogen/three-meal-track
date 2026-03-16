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
import { HomeDialogs } from "@/components/home/HomeDialogs";
import { useFastingStore } from "@/stores/fastingStore";
import { Square, Play } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type MealType = "breakfast" | "lunch" | "dinner";

const Index = () => {
  const [loadingMeal, setLoadingMeal] = useState<MealType | null>(null);
  const { setShowFastingComplete, setShowEarlyEndConfirm } = useFastingStore();

  const fastingHours = 16;
  const fastingMinutes = 2;
  const fastingSeconds = 45;
  const targetHours = 16;
  const isInFastingWindow = true;

  const handleEndFasting = () => {
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

  return (
    <div className="min-h-screen bg-background pb-24 page-enter">
      <div className="h-12" />

      <div className="px-4 max-w-md mx-auto space-y-6">
        {/* ① 顶部问候栏 */}
        <HomeHeader />

        {/* ② 呼吸光晕计时器 */}
        <div className="flex justify-center animate-card-appear">
          <div className="animate-breathing" style={{ animationDuration: "3s" }}>
            <CircularProgress
              currentHours={fastingHours}
              currentMinutes={fastingMinutes}
              currentSeconds={fastingSeconds}
              targetHours={targetHours}
              isInFastingWindow={isInFastingWindow}
            />
          </div>
        </div>

        {/* ③ 生理阶段指示器 */}
        <PhaseIndicator currentHours={fastingHours} />

        {/* ④ 时间信息卡片 */}
        <TimeInfoCards startTime="今天 19:30" endTime="明天 11:30" />

        {/* ⑤ 主操作按钮 */}
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

        {/* ⑥ 今日餐食概览 */}
        <TodayMealsOverview />

        {/* ⑦ AI 智能洞察卡片 */}
        <AIIntelligenceCard />

        {/* ⑧ 数据卡片网格 */}
        <DataCardsGrid />

        {/* ⑨ 快速操作栏 */}
        <QuickActionBar />
      </div>

      <BottomNavigation />
      <HomeDialogs onMealLoading={setLoadingMeal} />
    </div>
  );
};

export default Index;
