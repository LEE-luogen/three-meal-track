import { Utensils, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMeals } from "@/hooks/useMeals";
import { useUserStore } from "@/stores/userStore";
import breakfastImg from "@/assets/breakfast.jpg";
import lunchImg from "@/assets/lunch.jpg";
import dinnerImg from "@/assets/dinner.jpg";

const defaultImages: Record<string, string> = {
  breakfast: breakfastImg,
  lunch: lunchImg,
  dinner: dinnerImg,
};

const mealLabels: Record<string, string> = {
  breakfast: "早餐",
  lunch: "午餐",
  dinner: "晚餐",
};

const mealColors: Record<string, string> = {
  breakfast: "breakfast",
  lunch: "lunch",
  dinner: "dinner",
};

interface TodayMealsOverviewProps {
  className?: string;
}

export function TodayMealsOverview({ className }: TodayMealsOverviewProps) {
  const { meals, todayCalories, loading } = useMeals();
  const { setShowCamera, setShowPaywall, subscriptionType } = useUserStore();

  const mealTypes = ["breakfast", "lunch", "dinner"] as const;

  const getMealByType = (type: string) => meals.find(m => m.meal_type === type);
  const mealsRecorded = mealTypes.filter(t => getMealByType(t)).length;

  const handleAddMeal = () => {
    if (subscriptionType === "free") {
      setShowPaywall(true);
    } else {
      setShowCamera(true);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Utensils className="w-4 h-4 text-foreground" />
          <h2 className="text-base font-semibold text-foreground">今日餐食</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {loading ? "--" : `${Math.round(todayCalories)}`} kcal
          </span>
          <span className="text-xs text-muted-foreground">{mealsRecorded}/3 餐</span>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
        {mealTypes.map((type) => {
          const meal = getMealByType(type);
          const colorVar = mealColors[type];
          return (
            <div
              key={type}
              className="flex-shrink-0 w-[140px] rounded-2xl overflow-hidden shadow-card card-hover bg-card"
              onClick={!meal ? handleAddMeal : undefined}
            >
              {meal ? (
                <>
                  <div className="h-20 overflow-hidden">
                    <img
                      src={meal.photo_url || defaultImages[type]}
                      alt={meal.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2.5">
                    <div className="flex items-center gap-1 mb-1">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: `hsl(var(--${colorVar}))` }}
                      />
                      <span className="text-[10px] text-muted-foreground">
                        {mealLabels[type]} · {new Date(meal.eaten_at).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-foreground truncate">{meal.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{meal.calories || 0} kcal</p>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-8 px-3 cursor-pointer">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                    style={{ backgroundColor: `hsl(var(--${colorVar}) / 0.1)` }}
                  >
                    <Camera className="w-4 h-4" style={{ color: `hsl(var(--${colorVar}))` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{mealLabels[type]}</span>
                  <span className="text-[10px] text-muted-foreground/60 mt-0.5">点击记录</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
