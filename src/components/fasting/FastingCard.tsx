import { useState } from "react";
import { CircularProgress } from "./CircularProgress";
import { Calendar, Square, ChevronDown } from "lucide-react";
import { useFastingStore } from "@/stores/fastingStore";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FastingCardProps {
  fastingHours: number;
  fastingMinutes: number;
  fastingSeconds?: number;
  targetHours: number;
  isInFastingWindow: boolean;
  startTime?: string;
  endTime?: string;
}

export function FastingCard({
  fastingHours,
  fastingMinutes,
  fastingSeconds = 0,
  targetHours,
  isInFastingWindow,
  startTime = "今天 19:30",
  endTime = "明天 11:30",
}: FastingCardProps) {
  const { setShowFastingComplete, setShowEarlyEndConfirm } = useFastingStore();
  const [expanded, setExpanded] = useState(false);

  const handleEndFasting = () => {
    const totalMinutes = fastingHours * 60 + fastingMinutes;
    const targetMinutes = targetHours * 60;

    if (totalMinutes >= targetMinutes) {
      setShowFastingComplete(true);
    } else if (totalMinutes > 30) {
      setShowEarlyEndConfirm(true);
    } else {
      toast({
        title: "断食时间过短",
        description: "断食需超过30分钟才会被记录",
      });
    }
  };

  return (
    <div id="fasting-card" className="bg-card rounded-2xl shadow-card animate-slide-up overflow-hidden">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
        <h2 className="text-lg font-semibold text-foreground">Flux</h2>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 rounded-lg bg-muted text-sm text-muted-foreground hover:bg-muted/80 transition-colors">
            补录断食
          </button>
          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* 圆环进度 */}
      <div className="px-5 py-6">
        <CircularProgress
          currentHours={fastingHours}
          currentMinutes={fastingMinutes}
          currentSeconds={fastingSeconds}
          targetHours={targetHours}
          isInFastingWindow={isInFastingWindow}
        />
      </div>

      {/* 可折叠的阶段详情 */}
      <div className="mx-5 mb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground">能量储存中</span>
            <span className="text-xs text-muted-foreground">
              {String(fastingHours).padStart(2, "0")}:{String(fastingMinutes).padStart(2, "0")} / {targetHours}:00
            </span>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
                  <span>下一阶段: 血糖平稳期</span>
                  <span>4.0 小时后</span>
                </div>

                {/* AI 提示 */}
                <div className="p-3 bg-warning/5 rounded-lg border border-warning/20">
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    <span className="text-warning mr-1">○</span>
                    你刚刚享用完一顿美餐，身体正在消化食物并吸收营养。此时胰岛素水平升高，身体处于"合成模式"。
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 开始/结束时间 - 简化为单行 */}
      <div className="mx-5 mb-4 flex items-center justify-between text-sm px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-muted-foreground">开始</span>
          <span className="text-foreground font-medium">{startTime}</span>
        </div>
        <div className={cn(
          "h-[1px] flex-1 mx-3",
          "bg-gradient-to-r from-primary/30 via-border to-muted-foreground/20"
        )} />
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
          <span className="text-muted-foreground">结束</span>
          <span className="text-foreground font-medium">{endTime}</span>
        </div>
      </div>

      {/* 结束断食按钮 */}
      <div className="px-5 pb-5">
        <button
          onClick={handleEndFasting}
          className="w-full py-4 bg-foreground text-background rounded-2xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Square className="w-4 h-4" />
          结束断食
        </button>
      </div>
    </div>
  );
}
