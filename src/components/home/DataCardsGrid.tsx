import { Apple, Activity, Trophy, Users, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMeals } from "@/hooks/useMeals";
import { useAchievements } from "@/hooks/useAchievements";
import { useProfile } from "@/hooks/useProfile";

interface DataCardsGridProps {
  className?: string;
}

export function DataCardsGrid({ className }: DataCardsGridProps) {
  const { todayCalories, todayProtein, todayCarbs, todayFat } = useMeals();
  const { unlockedCount, totalCount } = useAchievements();
  const { profile } = useProfile();
  const isPro = profile?.is_pro ?? false;

  // Simple nutrition score based on macro balance
  const totalMacros = todayProtein + todayCarbs + todayFat;
  const nutritionScore = totalMacros > 0
    ? Math.min(100, Math.round(
        (Math.min(todayProtein / 50, 1) * 40) +
        (Math.min(todayCarbs / 200, 1) * 30) +
        (Math.min(todayFat / 60, 1) * 30)
      ))
    : 0;

  const cards = [
    {
      icon: Apple,
      label: "营养平衡",
      value: totalMacros > 0 ? `${nutritionScore}/100` : "--",
      subtext: totalMacros > 0 ? `${Math.round(todayCalories)} kcal 已摄入` : "暂无数据",
      colorVar: "primary",
      isLocked: false,
    },
    {
      icon: Activity,
      label: "代谢趋势",
      value: "--",
      subtext: "需要更多数据",
      colorVar: "warning",
      isLocked: false,
    },
    {
      icon: Trophy,
      label: "成就徽章",
      value: `${unlockedCount}/${totalCount}`,
      subtext: unlockedCount > 0 ? "继续解锁更多" : "开始你的旅程",
      colorVar: "pro-gold",
      isLocked: false,
    },
    {
      icon: Users,
      label: "好友排名",
      value: "--",
      subtext: "本周排行",
      colorVar: "accent",
      isLocked: !isPro,
    },
  ];

  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-card rounded-2xl p-4 shadow-card card-hover relative overflow-hidden animate-card-appear"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {card.isLocked && (
              <div className="absolute inset-0 bg-card/80 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl">
                <div className="flex flex-col items-center gap-1">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Pro 功能</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `hsl(var(--${card.colorVar}) / 0.1)` }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: `hsl(var(--${card.colorVar}))` }} />
              </div>
              <span className="text-xs text-muted-foreground">{card.label}</span>
            </div>
            <div className="text-xl font-bold text-foreground">{card.value}</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">{card.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
