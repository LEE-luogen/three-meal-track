import { useState, useCallback } from 'react';
import { FastingCard } from "@/components/fasting/FastingCard";
import { MealTimeline } from "@/components/fasting/MealTimeline";
import { AISummaryCard } from "@/components/fasting/AISummaryCard";
import { NutrientEnergyBar } from "@/components/fasting/NutrientEnergyBar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { PaywallModal } from "@/components/modals/PaywallModal";
import { PhotoMealModal } from "@/components/modals/PhotoMealModal";
import { FastingCompleteSheet } from "@/components/fasting/FastingCompleteSheet";
import { EarlyEndDrawer } from "@/components/fasting/EarlyEndDrawer";
import { StartFastingDrawer } from "@/components/fasting/StartFastingDrawer";
import { EndFastingConfirmDrawer } from "@/components/fasting/EndFastingConfirmDrawer";
import { EarlyEndResultSheet } from "@/components/fasting/EarlyEndResultSheet";
import { FastingRecordDrawer } from "@/components/fasting/FastingRecordDrawer";
import { TimeConflictAlert } from "@/components/fasting/TimeConflictAlert";
import { MealDetailDrawer } from "@/components/fasting/MealDetailDrawer";
import { DeleteMealAlert } from "@/components/fasting/DeleteMealAlert";
import { useFastingStore } from "@/stores/fastingStore";
import { toast } from "@/hooks/use-toast";

type MealType = "breakfast" | "lunch" | "dinner";

const Index = () => {
  const {
    showFastingComplete,
    setShowFastingComplete,
    showEarlyEndConfirm,
    setShowEarlyEndConfirm,
    planType,
    targetHours,
    endFasting,
    newBadge,
  } = useFastingStore();

  // 抽屉/弹框状态
  const [showStartFasting, setShowStartFasting] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showEarlyEndResult, setShowEarlyEndResult] = useState(false);
  const [showFastingRecord, setShowFastingRecord] = useState(false);
  const [showTimeConflict, setShowTimeConflict] = useState(false);
  const [showMealDetail, setShowMealDetail] = useState(false);
  const [showDeleteMeal, setShowDeleteMeal] = useState(false);
  const [showPhotoMeal, setShowPhotoMeal] = useState(false);

  // 餐食加载状态
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

  const aiSummary = {
    totalCalories: 785,
    mealsRecorded: 2,
    analysis:
      "今日热量控制良好，请继续保持。建议晚餐保持清淡，避免过晚进食，有助于夜间代谢与睡眠质量。",
  };

  const sampleMeal = {
    id: '1',
    name: '牛油果鸡蛋吐司',
    time: '07:21',
    calories: 275,
    note: '配了一杯黑咖啡',
    type: 'breakfast' as const,
  };

  // 拍照识别回调：模拟 AI 加载
  const handlePhotoTaken = useCallback((mealType: MealType, source: "camera" | "album") => {
    setLoadingMeal(mealType);
    toast({
      title: "照片已上传",
      description: `正在使用 AI 识别${source === "camera" ? "拍摄" : "上传"}的食物...`,
    });
    // 模拟 AI 识别延迟
    setTimeout(() => {
      setLoadingMeal(null);
      toast({
        title: "识别完成",
        description: "已自动填入营养信息",
      });
    }, 3000);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="h-12" />

      <div className="px-4 max-w-md mx-auto space-y-5">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">今日饮食</h1>
            <p className="text-sm text-muted-foreground mt-0.5">周六 · 1月25日</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
            李
          </div>
        </div>

        {/* 测试入口按钮组 */}
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <p className="text-sm text-muted-foreground mb-3">测试交互组件：</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setShowStartFasting(true)} className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors">
              开始断食
            </button>
            <button onClick={() => setShowEndConfirm(true)} className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors">
              结束确认
            </button>
            <button onClick={() => setShowEarlyEndResult(true)} className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors">
              提前结束结果
            </button>
            <button onClick={() => setShowFastingRecord(true)} className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors">
              补录断食
            </button>
            <button onClick={() => setShowTimeConflict(true)} className="px-3 py-2 bg-warning/10 text-warning rounded-lg text-sm hover:bg-warning/20 transition-colors">
              时间冲突
            </button>
            <button onClick={() => setShowMealDetail(true)} className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors">
              餐食详情
            </button>
            <button onClick={() => setShowPhotoMeal(true)} className="px-3 py-2 bg-accent/10 text-accent rounded-lg text-sm hover:bg-accent/20 transition-colors">
              📷 拍照记录(付费)
            </button>
            <button onClick={() => setShowDeleteMeal(true)} className="px-3 py-2 bg-destructive/10 text-destructive rounded-lg text-sm hover:bg-destructive/20 transition-colors">
              删除餐食
            </button>
          </div>
        </div>

        {/* 断食状态卡片 */}
        <FastingCard {...fastingData} />

        {/* 三餐时间轴 */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span>三餐记录</span>
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">时间轴</span>
          </h2>
          <MealTimeline {...mealsData} />
        </div>

        {/* AI 分析卡片 */}
        <AISummaryCard {...aiSummary} />

        {/* 动态能量条 */}
        <NutrientEnergyBar
          fat={{ value: 24, max: 65 }}
          carbs={{ value: 180, max: 300 }}
          protein={{ value: 52, max: 80 }}
          micros={{ value: 68, max: 100 }}
        />
      </div>

      <BottomNavigation />

      {/* 弹层组件 */}
      <PaywallModal />
      <PhotoMealModal
        open={showPhotoMeal}
        onOpenChange={setShowPhotoMeal}
        onPhotoTaken={handlePhotoTaken}
      />

      <FastingCompleteSheet
        open={showFastingComplete}
        onOpenChange={setShowFastingComplete}
        fastingDuration={{ hours: fastingData.fastingHours, minutes: fastingData.fastingMinutes }}
        targetHours={targetHours}
        planType={planType}
        newBadge={newBadge}
        onStartEating={(weight) => {
          if (weight) toast({ title: "体重已记录", description: `${weight} kg` });
          endFasting();
          setShowFastingComplete(false);
        }}
        onViewDetails={() => {
          endFasting();
          setShowFastingComplete(false);
        }}
      />

      <EarlyEndDrawer
        open={showEarlyEndConfirm}
        onOpenChange={setShowEarlyEndConfirm}
        currentDuration={{ hours: fastingData.fastingHours, minutes: fastingData.fastingMinutes }}
        targetHours={targetHours}
        onContinue={() => setShowEarlyEndConfirm(false)}
        onConfirmEnd={(reason) => {
          endFasting(reason);
          toast({ title: "已记录本次断食", description: `${fastingData.fastingHours}小时${fastingData.fastingMinutes}分钟` });
        }}
      />

      <StartFastingDrawer
        open={showStartFasting}
        onOpenChange={setShowStartFasting}
        onStart={(plan, startTime, endTime) => {
          toast({ title: "断食已开始", description: `${plan} 计划，预计 ${endTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })} 结束` });
        }}
      />

      <EndFastingConfirmDrawer
        open={showEndConfirm}
        onOpenChange={setShowEndConfirm}
        currentDuration={{ hours: fastingData.fastingHours, minutes: fastingData.fastingMinutes }}
        targetHours={targetHours}
        onContinue={() => setShowEndConfirm(false)}
        onConfirmEnd={(reason) => {
          setShowEndConfirm(false);
          if (fastingData.fastingHours >= targetHours) {
            setShowFastingComplete(true);
          } else {
            setShowEarlyEndResult(true);
          }
        }}
      />

      <EarlyEndResultSheet
        open={showEarlyEndResult}
        onOpenChange={setShowEarlyEndResult}
        fastingDuration={{ hours: fastingData.fastingHours, minutes: fastingData.fastingMinutes }}
        targetHours={targetHours}
        onStartEating={() => {
          setShowEarlyEndResult(false);
          toast({ title: "进入进食窗口", description: "开始记录你的饮食吧" });
        }}
        onAdjustPlan={() => {
          setShowEarlyEndResult(false);
          setShowStartFasting(true);
        }}
      />

      <FastingRecordDrawer
        open={showFastingRecord}
        onOpenChange={setShowFastingRecord}
        mode="add"
        onSave={(data) => {
          const duration = (data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60 * 60);
          toast({ title: "补录成功", description: `已记录 ${duration.toFixed(1)} 小时断食` });
        }}
        onConflict={() => {
          setShowFastingRecord(false);
          setShowTimeConflict(true);
        }}
      />

      <TimeConflictAlert
        open={showTimeConflict}
        onOpenChange={setShowTimeConflict}
        conflictTimeRange="08:00-16:00"
        onModify={() => setShowFastingRecord(true)}
        onCancel={() => {}}
      />

      <MealDetailDrawer
        open={showMealDetail}
        onOpenChange={setShowMealDetail}
        meal={sampleMeal}
        onEdit={() => toast({ title: "编辑餐食", description: "进入编辑模式" })}
        onDelete={() => {
          setShowMealDetail(false);
          setShowDeleteMeal(true);
        }}
      />

      <DeleteMealAlert
        open={showDeleteMeal}
        onOpenChange={setShowDeleteMeal}
        mealName={sampleMeal.name}
        onConfirm={() => toast({ title: "已删除", description: `「${sampleMeal.name}」已被删除` })}
        onCancel={() => {}}
      />
    </div>
  );
};

export default Index;
