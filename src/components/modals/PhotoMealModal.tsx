import { useState } from "react";
import { Camera, Image, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type MealType = "breakfast" | "lunch" | "dinner";

interface PhotoMealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPhotoTaken: (mealType: MealType, source: "camera" | "album") => void;
}

const mealOptions: { type: MealType; label: string; icon: string }[] = [
  { type: "breakfast", label: "早餐", icon: "🌅" },
  { type: "lunch", label: "午餐", icon: "☀️" },
  { type: "dinner", label: "晚餐", icon: "🌙" },
];

export function PhotoMealModal({ open, onOpenChange, onPhotoTaken }: PhotoMealModalProps) {
  const [selectedMeal, setSelectedMeal] = useState<MealType | null>(null);
  const [step, setStep] = useState<"select" | "capture">("select");

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSelectedMeal(null);
      setStep("select");
    }, 300);
  };

  const handleMealSelect = (type: MealType) => {
    setSelectedMeal(type);
  };

  const handleNext = () => {
    if (selectedMeal) setStep("capture");
  };

  const handleCapture = (source: "camera" | "album") => {
    if (selectedMeal) {
      onPhotoTaken(selectedMeal, source);
      handleClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* 内容 */}
      <div className="relative w-full max-w-md bg-card rounded-t-3xl shadow-xl animate-slide-up z-10">
        {/* 拖拽指示器 */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="px-6 pb-8">
          {step === "select" ? (
            <>
              <h3 className="text-lg font-semibold text-foreground mb-1">AI 食物识别</h3>
              <p className="text-sm text-muted-foreground mb-5">选择要记录的餐次</p>

              {/* 三餐选择 */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {mealOptions.map((meal) => (
                  <button
                    key={meal.type}
                    onClick={() => handleMealSelect(meal.type)}
                    className={cn(
                      "relative flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all",
                      selectedMeal === meal.type
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-card hover:border-primary/30"
                    )}
                  >
                    <span className="text-2xl">{meal.icon}</span>
                    <span className={cn(
                      "text-sm font-medium",
                      selectedMeal === meal.type ? "text-primary" : "text-foreground"
                    )}>
                      {meal.label}
                    </span>
                    {selectedMeal === meal.type && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={!selectedMeal}
                className={cn(
                  "w-full py-4 rounded-2xl font-medium transition-all",
                  selectedMeal
                    ? "bg-foreground text-background hover:opacity-90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                下一步
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-foreground mb-1">拍照或上传</h3>
              <p className="text-sm text-muted-foreground mb-6">
                拍摄食物照片，AI 将自动识别营养信息
              </p>

              {/* 拍照区域 */}
              <div className="aspect-[4/3] bg-muted rounded-2xl flex items-center justify-center mb-6 overflow-hidden">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-foreground/5 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">点击下方按钮开始</p>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => handleCapture("album")}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-muted transition-colors"
                >
                  <Image className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">相册</span>
                </button>
                <button
                  onClick={() => handleCapture("camera")}
                  className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95"
                >
                  <div className="w-12 h-12 rounded-full border-4 border-primary-foreground" />
                </button>
                <div className="w-[88px]" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
