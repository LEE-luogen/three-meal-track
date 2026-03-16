import { motion } from "framer-motion";
import { Timer, Flame, Scale, Utensils } from "lucide-react";

interface StatusCapsule {
  icon: React.ElementType;
  label: string;
  value: string;
  colorVar: string;
  targetId?: string;
}

interface DailyStatusBarProps {
  fastingTime?: string;
  totalCalories?: number;
  weight?: number;
  mealsRecorded?: number;
  totalMeals?: number;
}

export function DailyStatusBar({
  fastingTime = "16:02",
  totalCalories = 785,
  weight = 71.0,
  mealsRecorded = 2,
  totalMeals = 3,
}: DailyStatusBarProps) {
  const capsules: StatusCapsule[] = [
    {
      icon: Timer,
      label: "断食",
      value: fastingTime,
      colorVar: "primary",
      targetId: "fasting-card",
    },
    {
      icon: Flame,
      label: "摄入",
      value: `${totalCalories} kcal`,
      colorVar: "warning",
      targetId: "ai-insights",
    },
    {
      icon: Scale,
      label: "体重",
      value: `${weight} kg`,
      colorVar: "accent",
      targetId: "weight-card",
    },
    {
      icon: Utensils,
      label: "记录",
      value: `${mealsRecorded}/${totalMeals} 顿`,
      colorVar: "lunch",
      targetId: "meal-timeline",
    },
  ];

  const handleClick = (targetId?: string) => {
    if (!targetId) return;
    const el = document.getElementById(targetId);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="flex gap-2.5 overflow-x-auto scrollbar-hide -mx-4 px-4">
      {capsules.map((capsule, i) => {
        const Icon = capsule.icon;
        return (
          <motion.button
            key={capsule.label}
            onClick={() => handleClick(capsule.targetId)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.35,
              delay: 0.1 + i * 0.06,
              ease: "easeOut",
            }}
            className="flex items-center gap-2 h-9 px-3.5 rounded-full bg-card shadow-card whitespace-nowrap flex-shrink-0 hover:shadow-card-hover transition-shadow active:scale-[0.97]"
          >
            <div
              className="w-[6px] h-[6px] rounded-full flex-shrink-0"
              style={{
                backgroundColor: `hsl(var(--${capsule.colorVar}))`,
              }}
            />
            <span className="text-xs text-muted-foreground">{capsule.label}</span>
            <span className="text-xs font-semibold text-foreground">{capsule.value}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
