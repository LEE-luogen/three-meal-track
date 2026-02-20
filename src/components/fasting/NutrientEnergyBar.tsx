import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NutrientData {
  label: string;
  unit: string;
  value: number;
  max: number;
  color: string;
}

interface NutrientEnergyBarProps {
  fat: { value: number; max: number };
  carbs: { value: number; max: number };
  protein: { value: number; max: number };
  micros: { value: number; max: number };
  className?: string;
}

export function NutrientEnergyBar({
  fat,
  carbs,
  protein,
  micros,
  className,
}: NutrientEnergyBarProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const nutrients: NutrientData[] = [
    { label: "FAT", unit: "g", value: fat.value, max: fat.max, color: "bg-[hsl(25,80%,75%)]" },
    { label: "CARBS", unit: "g", value: carbs.value, max: carbs.max, color: "bg-[hsl(45,70%,65%)]" },
    { label: "PROTEIN", unit: "g", value: protein.value, max: protein.max, color: "bg-[hsl(200,60%,60%)]" },
    { label: "MICROS", unit: "%", value: micros.value, max: micros.max, color: "bg-[hsl(270,50%,70%)]" },
  ];

  return (
    <div className={cn("py-5 px-4", className)}>
      <div className="grid grid-cols-4 gap-0">
        {nutrients.map((n) => {
          const percent = Math.min((n.value / n.max) * 100, 100);
          return (
            <div key={n.label} className="flex flex-col items-center">
              {/* 标签 */}
              <span className="text-[10px] tracking-widest text-muted-foreground/60 uppercase font-medium mb-1.5">
                {n.label}
              </span>
              {/* 数值 */}
              <span className="text-2xl font-semibold text-foreground leading-none">
                {n.value}
              </span>
              {/* 单位 */}
              <span className="text-[10px] text-muted-foreground/50 mt-0.5 mb-3">
                {n.unit}
              </span>
              {/* 微进度条 */}
              <div className="w-10 h-[2px] bg-muted/60 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out",
                    n.color
                  )}
                  style={{
                    width: animated ? `${percent}%` : "0%",
                    transitionDelay: "300ms",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
