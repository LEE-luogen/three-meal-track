import { FastingCard } from "@/components/fasting/FastingCard";
import { MealTimeline } from "@/components/fasting/MealTimeline";
import { AISummaryCard } from "@/components/fasting/AISummaryCard";

const Index = () => {
  // 示例数据
  const fastingData = {
    fastingHours: 0,
    fastingMinutes: 0,
    fastingSeconds: 3,
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
    },
    lunch: {
      status: "recorded" as const,
      time: "12:35",
      foodName: "鸡胸肉藜麦沙拉",
      calories: 510,
      tags: ["高蛋白", "低GI", "复食适用"],
    },
    dinner: {
      status: "pending" as const,
    },
  };

  const aiSummary = {
    totalCalories: 785,
    mealsRecorded: 2,
    analysis:
      "今日热量控制良好，请继续保持。建议晚餐保持清淡，避免过晚进食，有助于夜间代谢与睡眠质量。",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部安全区域 */}
      <div className="h-12" />

      {/* 主内容区 */}
      <div className="px-4 pb-8 max-w-md mx-auto space-y-5">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">今日饮食</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              周六 · 1月25日
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
            李
          </div>
        </div>

        {/* 断食状态卡片 */}
        <FastingCard {...fastingData} />

        {/* 三餐时间轴 */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span>三餐记录</span>
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              时间轴
            </span>
          </h2>
          <MealTimeline {...mealsData} />
        </div>

        {/* AI 分析卡片 */}
        <AISummaryCard {...aiSummary} />
      </div>
    </div>
  );
};

export default Index;
