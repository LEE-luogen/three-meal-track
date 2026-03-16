import { useState, useCallback } from "react";
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

interface HomeDialogsProps {
  onMealLoading?: (type: MealType | null) => void;
}

export function HomeDialogs({ onMealLoading }: HomeDialogsProps) {
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

  const [showStartFasting, setShowStartFasting] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showEarlyEndResult, setShowEarlyEndResult] = useState(false);
  const [showFastingRecord, setShowFastingRecord] = useState(false);
  const [showTimeConflict, setShowTimeConflict] = useState(false);
  const [showMealDetail, setShowMealDetail] = useState(false);
  const [showDeleteMeal, setShowDeleteMeal] = useState(false);
  const [showPhotoMeal, setShowPhotoMeal] = useState(false);

  const fastingHours = 16;
  const fastingMinutes = 2;

  const sampleMeal = {
    id: "1",
    name: "牛油果鸡蛋吐司",
    time: "07:21",
    calories: 275,
    note: "配了一杯黑咖啡",
    type: "breakfast" as const,
  };

  const handlePhotoTaken = useCallback(
    (mealType: MealType, source: "camera" | "album") => {
      onMealLoading?.(mealType);
      toast({
        title: "照片已上传",
        description: `正在使用 AI 识别${source === "camera" ? "拍摄" : "上传"}的食物...`,
      });
      setTimeout(() => {
        onMealLoading?.(null);
        toast({ title: "识别完成", description: "已自动填入营养信息" });
      }, 3000);
    },
    [onMealLoading]
  );

  return (
    <>
      <PaywallModal />
      <PhotoMealModal
        open={showPhotoMeal}
        onOpenChange={setShowPhotoMeal}
        onPhotoTaken={handlePhotoTaken}
      />

      <FastingCompleteSheet
        open={showFastingComplete}
        onOpenChange={setShowFastingComplete}
        fastingDuration={{ hours: fastingHours, minutes: fastingMinutes }}
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
        currentDuration={{ hours: fastingHours, minutes: fastingMinutes }}
        targetHours={targetHours}
        onContinue={() => setShowEarlyEndConfirm(false)}
        onConfirmEnd={(reason) => {
          endFasting(reason);
          toast({
            title: "已记录本次断食",
            description: `${fastingHours}小时${fastingMinutes}分钟`,
          });
        }}
      />

      <StartFastingDrawer
        open={showStartFasting}
        onOpenChange={setShowStartFasting}
        onStart={(plan, startTime, endTime) => {
          toast({
            title: "断食已开始",
            description: `${plan} 计划，预计 ${endTime.toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
            })} 结束`,
          });
        }}
      />

      <EndFastingConfirmDrawer
        open={showEndConfirm}
        onOpenChange={setShowEndConfirm}
        currentDuration={{ hours: fastingHours, minutes: fastingMinutes }}
        targetHours={targetHours}
        onContinue={() => setShowEndConfirm(false)}
        onConfirmEnd={() => {
          setShowEndConfirm(false);
          if (fastingHours >= targetHours) {
            setShowFastingComplete(true);
          } else {
            setShowEarlyEndResult(true);
          }
        }}
      />

      <EarlyEndResultSheet
        open={showEarlyEndResult}
        onOpenChange={setShowEarlyEndResult}
        fastingDuration={{ hours: fastingHours, minutes: fastingMinutes }}
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
          const duration =
            (data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60 * 60);
          toast({
            title: "补录成功",
            description: `已记录 ${duration.toFixed(1)} 小时断食`,
          });
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
        onConfirm={() =>
          toast({ title: "已删除", description: `「${sampleMeal.name}」已被删除` })
        }
        onCancel={() => {}}
      />
    </>
  );
}
