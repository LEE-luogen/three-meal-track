import { ChevronRight, Plus, Clock, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export type MealType = "breakfast" | "lunch" | "dinner";
export type MealStatus = "recorded" | "pending" | "active";

interface MealCardProps {
  type: MealType;
  status: MealStatus;
  time?: string;
  foodName?: string;
  calories?: number;
  imageUrl?: string;
  tags?: string[];
  onClick?: () => void;
}

const mealConfig = {
  breakfast: {
    label: "早餐",
    icon: "🌅",
    colorClass: "breakfast",
    timeRange: "6:00 - 9:00",
  },
  lunch: {
    label: "午餐",
    icon: "☀️",
    colorClass: "lunch",
    timeRange: "11:00 - 13:00",
  },
  dinner: {
    label: "晚餐",
    icon: "🌙",
    colorClass: "dinner",
    timeRange: "17:00 - 19:00",
  },
};

export function MealCard({
  type,
  status,
  time,
  foodName,
  calories,
  imageUrl,
  tags,
  onClick,
}: MealCardProps) {
  const config = mealConfig[type];
  const isRecorded = status === "recorded";
  const isPending = status === "pending";
  const isActive = status === "active";

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-2xl p-4 transition-all duration-300 cursor-pointer",
        "bg-card shadow-card hover:shadow-card-hover",
        isActive && [
          type === "breakfast" && "ring-2 ring-breakfast/30 shadow-glow-breakfast",
          type === "lunch" && "ring-2 ring-lunch/30 shadow-glow-lunch",
          type === "dinner" && "ring-2 ring-dinner/30 shadow-glow-dinner",
        ],
        "animate-slide-up"
      )}
      style={{ animationDelay: `${type === "breakfast" ? 0 : type === "lunch" ? 100 : 200}ms` }}
    >
      {/* 顶部状态条 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.icon}</span>
          <span
            className={cn(
              "text-sm font-semibold",
              type === "breakfast" && "text-breakfast-foreground",
              type === "lunch" && "text-lunch-foreground",
              type === "dinner" && "text-dinner-foreground"
            )}
          >
            {config.label}
          </span>
          {isActive && (
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full animate-pulse-soft",
                type === "breakfast" && "bg-breakfast-light text-breakfast",
                type === "lunch" && "bg-lunch-light text-lunch",
                type === "dinner" && "bg-dinner-light text-dinner"
              )}
            >
              进食中
            </span>
          )}
        </div>
        {time && (
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <Clock className="w-3 h-3" />
            <span>{time}</span>
          </div>
        )}
      </div>

      {isRecorded && imageUrl ? (
        /* 已记录状态 - 显示食物详情 */
        <div className="flex gap-3">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={imageUrl}
              alt={foodName}
              className="w-full h-full object-cover"
            />
            <div
              className={cn(
                "absolute inset-0 opacity-20",
                type === "breakfast" && "bg-gradient-to-br from-breakfast to-transparent",
                type === "lunch" && "bg-gradient-to-br from-lunch to-transparent",
                type === "dinner" && "bg-gradient-to-br from-dinner to-transparent"
              )}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground truncate mb-1">
              {foodName}
            </h4>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Flame
                  className={cn(
                    "w-4 h-4",
                    type === "breakfast" && "text-breakfast",
                    type === "lunch" && "text-lunch",
                    type === "dinner" && "text-dinner"
                  )}
                />
                <span className="text-sm font-semibold text-foreground">
                  {calories}
                </span>
                <span className="text-xs text-muted-foreground">kcal</span>
              </div>
            </div>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      type === "breakfast" && "bg-breakfast-light text-breakfast-foreground",
                      type === "lunch" && "bg-lunch-light text-lunch-foreground",
                      type === "dinner" && "bg-dinner-light text-dinner-foreground"
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground self-center flex-shrink-0" />
        </div>
      ) : (
        /* 待记录状态 - 显示添加提示 */
        <div
          className={cn(
            "flex items-center justify-center py-4 rounded-xl border-2 border-dashed transition-colors",
            isPending && "border-muted-foreground/20 bg-muted/30",
            isActive && [
              type === "breakfast" && "border-breakfast/30 bg-breakfast-light/50",
              type === "lunch" && "border-lunch/30 bg-lunch-light/50",
              type === "dinner" && "border-dinner/30 bg-dinner-light/50",
            ]
          )}
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Plus
              className={cn(
                "w-5 h-5",
                isActive && [
                  type === "breakfast" && "text-breakfast",
                  type === "lunch" && "text-lunch",
                  type === "dinner" && "text-dinner",
                ]
              )}
            />
            <span className="text-sm">
              {isActive ? "点击记录这顿饭" : `建议时间 ${config.timeRange}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
