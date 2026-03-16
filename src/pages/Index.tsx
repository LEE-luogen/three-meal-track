import { useState } from "react";
import { HomeHeader } from "@/components/home/HomeHeader";
import { DailyStatusBar } from "@/components/home/DailyStatusBar";
import { FastingCard } from "@/components/fasting/FastingCard";
import { MealTimeline } from "@/components/fasting/MealTimeline";
import { AIInsightsSection } from "@/components/home/AIInsightsSection";
import { WeightCurveCard } from "@/components/fasting/WeightCurveCard";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { HomeDialogs } from "@/components/home/HomeDialogs";
import breakfastImg from "@/assets/breakfast.jpg";
import lunchImg from "@/assets/lunch.jpg";
import dinnerImg from "@/assets/dinner.jpg";

type MealType = "breakfast" | "lunch" | "dinner";

const Index = () => {
  const [loadingMeal, setLoadingMeal] = useState<MealType | null>(null);

  const fastingData = {
    fastingHours: 16,
    fastingMinutes: 2,
    fastingSeconds: 45,
    targetHours: 16,
    isInFastingWindow: true,
    startTime: "今天 19:30",
    endTime: "明天 11:30",
  };

  const mealsData = {
    breakfast: {
      status: "recorded" as const,
      time: "07:21",
      foodName: "牛油果鸡蛋吐司",
      calories: 275,
      tags: ["低卡饱腹", "高膳食纤维", "轻食餐品"],
      isLoading: loadingMeal === "breakfast",
    },
    lunch: {
      status: "recorded" as const,
      time: "12:35",
      foodName: "鸡胸肉藜麦沙拉",
      calories: 510,
      tags: ["高蛋白", "低GI", "复食适用"],
      isLoading: loadingMeal === "lunch",
    },
    dinner: {
      status: (loadingMeal === "dinner" ? "recorded" : "pending") as "recorded" | "pending",
      isLoading: loadingMeal === "dinner",
    },
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="h-12" />

      <div className="px-4 max-w-md mx-auto space-y-5">
        {/* ① 顶部问候栏 */}
        <HomeHeader />

        {/* ② 今日状态概览条 */}
        <DailyStatusBar
          fastingTime={`${fastingData.fastingHours}:${String(fastingData.fastingMinutes).padStart(2, "0")}`}
          totalCalories={785}
          weight={71.0}
          mealsRecorded={2}
          totalMeals={3}
        />

        {/* ③ 断食核心卡片 */}
        <FastingCard {...fastingData} />

        {/* ④ 三餐时间轴 */}
        <div id="meal-timeline">
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span>三餐记录</span>
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              时间轴
            </span>
          </h2>
          <MealTimeline {...mealsData} />
        </div>

        {/* ⑤ AI 洞察区（合并 AI分析 + 能量条） */}
        <AIInsightsSection
          totalCalories={785}
          mealsRecorded={2}
          fat={{ value: 24, max: 65 }}
          carbs={{ value: 180, max: 300 }}
          protein={{ value: 52, max: 80 }}
          micros={{ value: 68, max: 100 }}
        />

        {/* ⑥ 体重趋势卡片 */}
        <div id="weight-card" className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <WeightCurveCard />
        </div>
      </div>

      <BottomNavigation />
      <HomeDialogs onMealLoading={setLoadingMeal} />
    </div>
  );
};

export default Index;
