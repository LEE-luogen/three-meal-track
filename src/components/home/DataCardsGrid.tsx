import { Apple, Activity, Trophy, Users, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataCard {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext: string;
  colorVar: string;
  isLocked?: boolean;
}

interface DataCardsGridProps {
  nutritionScore?: number;
  metabolismTrend?: string;
  achievementsUnlocked?: number;
  achievementsTotal?: number;
  rank?: number;
  className?: string;
}

export function DataCardsGrid({
  nutritionScore = 85,
  metabolismTrend = "↑12%",
  achievementsUnlocked = 5,
  achievementsTotal = 12,
  rank = 3,
  className,
}: DataCardsGridProps) {
  const cards: DataCard[] = [
    {
      icon: Apple,
      label: "营养平衡",
      value: `${nutritionScore}/100`,
      subtext: "综合评分良好",
      colorVar: "primary",
    },
    {
      icon: Activity,
      label: "代谢趋势",
      value: metabolismTrend,
      subtext: "代谢灵活性",
      colorVar: "warning",
    },
    {
      icon: Trophy,
      label: "成就徽章",
      value: `${achievementsUnlocked}/${achievementsTotal}`,
      subtext: "继续解锁更多",
      colorVar: "pro-gold",
    },
    {
      icon: Users,
      label: "好友排名",
      value: `#${rank}`,
      subtext: "本周排行",
      colorVar: "accent",
      isLocked: true,
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
                <Icon
                  className="w-3.5 h-3.5"
                  style={{ color: `hsl(var(--${card.colorVar}))` }}
                />
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
