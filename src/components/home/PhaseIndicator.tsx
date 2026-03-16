import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Phase {
  id: number;
  name: string;
  shortName: string;
  range: string;
  description: string;
}

const PHASES: Phase[] = [
  { id: 1, name: "能量储存期", shortName: "能量", range: "0-4h", description: "消化食物，胰岛素上升" },
  { id: 2, name: "血糖平稳期", shortName: "血糖", range: "4-12h", description: "消耗肝糖原" },
  { id: 3, name: "脂肪燃烧期", shortName: "脂肪", range: "12-18h", description: "开始燃脂，产生酮体" },
  { id: 4, name: "细胞净化期", shortName: "细胞", range: "18-24h", description: "自噬作用启动" },
  { id: 5, name: "深度修复期", shortName: "修复", range: "24h+", description: "生长激素激增" },
];

function getCurrentPhase(hours: number): number {
  if (hours >= 24) return 5;
  if (hours >= 18) return 4;
  if (hours >= 12) return 3;
  if (hours >= 4) return 2;
  return 1;
}

function getPhaseProgress(hours: number, phaseId: number): number {
  const boundaries = [0, 4, 12, 18, 24, 48];
  const start = boundaries[phaseId - 1];
  const end = boundaries[phaseId];
  if (hours >= end) return 100;
  if (hours <= start) return 0;
  return ((hours - start) / (end - start)) * 100;
}

interface PhaseIndicatorProps {
  currentHours: number;
  className?: string;
}

export function PhaseIndicator({ currentHours, className }: PhaseIndicatorProps) {
  const currentPhase = getCurrentPhase(currentHours);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Phase dots row */}
      <div className="flex items-center gap-1">
        {PHASES.map((phase) => {
          const isCompleted = phase.id < currentPhase;
          const isActive = phase.id === currentPhase;
          const progress = getPhaseProgress(currentHours, phase.id);

          return (
            <div key={phase.id} className="flex-1 flex flex-col items-center gap-1.5">
              {/* Progress segment */}
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${isCompleted ? 100 : isActive ? progress : 0}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    backgroundColor: `hsl(var(--phase-${phase.id}))`,
                  }}
                />
              </div>
              {/* Dot + label */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-500",
                    isCompleted && "scale-100",
                    isActive && "scale-125 ring-2 ring-offset-1 ring-offset-background",
                    !isCompleted && !isActive && "opacity-40"
                  )}
                  style={{
                    backgroundColor: `hsl(var(--phase-${phase.id}))`,
                    ...(isActive ? { ringColor: `hsl(var(--phase-${phase.id}) / 0.3)` } : {}),
                  }}
                />
                <span
                  className={cn(
                    "text-[10px] mt-1 transition-colors",
                    isActive ? "text-foreground font-medium" : "text-muted-foreground/60"
                  )}
                >
                  {phase.shortName}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current phase detail */}
      <div
        className="px-3 py-2 rounded-xl text-sm"
        style={{
          backgroundColor: `hsl(var(--phase-${currentPhase}) / 0.08)`,
          borderLeft: `3px solid hsl(var(--phase-${currentPhase}))`,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground">
            {PHASES[currentPhase - 1].name}
          </span>
          <span className="text-xs text-muted-foreground">
            {PHASES[currentPhase - 1].range}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {PHASES[currentPhase - 1].description}
        </p>
      </div>
    </div>
  );
}
