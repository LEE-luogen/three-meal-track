import { Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeInfoCardsProps {
  startTime: string;
  endTime: string;
  className?: string;
}

export function TimeInfoCards({ startTime, endTime, className }: TimeInfoCardsProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      <div className="bg-card rounded-2xl p-4 shadow-card card-hover">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">开始时间</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-base font-semibold text-foreground">{startTime}</span>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-4 shadow-card card-hover">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
          <span className="text-xs text-muted-foreground">结束时间</span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-muted-foreground" />
          <span className="text-base font-semibold text-foreground">{endTime}</span>
        </div>
      </div>
    </div>
  );
}
