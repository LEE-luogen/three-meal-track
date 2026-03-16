import { Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import breakfastImg from "@/assets/breakfast.jpg";
import lunchImg from "@/assets/lunch.jpg";
import dinnerImg from "@/assets/dinner.jpg";

interface MealItem {
  type: "breakfast" | "lunch" | "dinner";
  label: string;
  status: "recorded" | "pending";
  time?: string;
  foodName?: string;
  calories?: number;
  image?: string;
  colorVar: string;
}

interface TodayMealsOverviewProps {
  totalCalories?: number;
  mealsRecorded?: number;
  totalMeals?: number;
  className?: string;
}

export function TodayMealsOverview({
  totalCalories = 785,
  mealsRecorded = 2,
  totalMeals = 3,
  className,
}: TodayMealsOverviewProps) {
  const meals: MealItem[] = [
    {
      type: "breakfast",
      label: "早餐",
      status: "recorded",
      time: "07:21",
      foodName: "牛油果鸡蛋吐司",
      calories: 275,
      image: breakfastImg,
      colorVar: "breakfast",
    },
    {
      type: "lunch",
      label: "午餐",
      status: "recorded",
      time: "12:35",
      foodName: "鸡胸肉藜麦沙拉",
      calories: 510,
      image: lunchImg,
      colorVar: "lunch",
    },
    {
      type: "dinner",
      label: "晚餐",
      status: "pending",
      colorVar: "dinner",
    },
  ];

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Utensils className="w-4 h-4 text-foreground" />
          <h2 className="text-base font-semibold text-foreground">今日餐食</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{totalCalories} kcal</span>
          <span className="text-xs text-muted-foreground">{mealsRecorded}/{totalMeals} 餐</span>
        </div>
      </div>

      {/* Horizontal scroll cards */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
        {meals.map((meal) => (
          <div
            key={meal.type}
            className={cn(
              "flex-shrink-0 w-[140px] rounded-2xl overflow-hidden shadow-card card-hover",
              "bg-card"
            )}
          >
            {meal.status === "recorded" ? (
              <>
                <div className="h-20 overflow-hidden">
                  <img
                    src={meal.image}
                    alt={meal.foodName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2.5">
                  <div className="flex items-center gap-1 mb-1">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: `hsl(var(--${meal.colorVar}))` }}
                    />
                    <span className="text-[10px] text-muted-foreground">{meal.label} · {meal.time}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground truncate">{meal.foodName}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{meal.calories} kcal</p>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-8 px-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                  style={{ backgroundColor: `hsl(var(--${meal.colorVar}) / 0.1)` }}
                >
                  <span
                    className="text-xl font-light"
                    style={{ color: `hsl(var(--${meal.colorVar}))` }}
                  >
                    +
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{meal.label}</span>
                <span className="text-[10px] text-muted-foreground/60 mt-0.5">点击记录</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
