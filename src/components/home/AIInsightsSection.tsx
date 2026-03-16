import { useEffect, useState, useRef } from "react";
import { Sparkles, TrendingUp, Utensils, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface NutrientItem {
  label: string;
  unit: string;
  value: number;
  max: number;
  color: string;
  glowColor: string;
}

interface AIInsightsSectionProps {
  totalCalories?: number;
  mealsRecorded?: number;
  analysis?: string;
  fat: { value: number; max: number };
  carbs: { value: number; max: number };
  protein: { value: number; max: number };
  micros: { value: number; max: number };
  className?: string;
}

function useCountUp(target: number, duration: number, start: boolean, delay: number) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!start) return;
    const timer = setTimeout(() => {
      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - (1 - progress) * (1 - progress);
        setCurrent(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, duration, start, delay]);
  return current;
}

function useTypewriter(text: string, start: boolean, speed = 30, delay = 200) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!start) return;
    setDisplayed("");
    const timer = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, start, speed, delay]);
  return displayed;
}

export function AIInsightsSection({
  totalCalories = 785,
  mealsRecorded = 2,
  analysis = "今日热量控制良好，请继续保持。建议晚餐保持清淡，避免过晚进食，有助于夜间代谢与睡眠质量。",
  fat,
  carbs,
  protein,
  micros,
  className,
}: AIInsightsSectionProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const analysisText = useTypewriter(analysis, visible, 25, 400);

  const nutrients: NutrientItem[] = [
    { label: "脂肪", unit: "g", value: fat.value, max: fat.max, color: "bg-[hsl(25,80%,75%)]", glowColor: "hsl(25,80%,75%)" },
    { label: "碳水", unit: "g", value: carbs.value, max: carbs.max, color: "bg-[hsl(45,70%,65%)]", glowColor: "hsl(45,70%,65%)" },
    { label: "蛋白质", unit: "g", value: protein.value, max: protein.max, color: "bg-[hsl(200,60%,60%)]", glowColor: "hsl(200,60%,60%)" },
    { label: "微量元素", unit: "%", value: micros.value, max: micros.max, color: "bg-[hsl(270,50%,70%)]", glowColor: "hsl(270,50%,70%)" },
  ];

  return (
    <div
      ref={ref}
      id="ai-insights"
      className={cn(
        "relative rounded-2xl overflow-hidden transition-all duration-700",
        visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.97]",
        className
      )}
    >
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--ai-gradient-start))] via-[hsl(var(--ai-gradient-end))] to-primary opacity-90" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 p-5 text-white">
        {/* 标题 */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-semibold">AI 综合餐饮分析</span>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 opacity-80" />
              <span className="text-xs opacity-80">今日摄入</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{totalCalories}</span>
              <span className="text-sm opacity-80">kcal</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Utensils className="w-4 h-4 opacity-80" />
              <span className="text-xs opacity-80">餐食记录</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{mealsRecorded}</span>
              <span className="text-sm opacity-80">顿</span>
            </div>
          </div>
        </div>

        {/* AI 分析 - 打字机效果 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 opacity-80 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs opacity-80 mb-1">今日饮食结构分析：</div>
              <p className="text-sm leading-relaxed opacity-95 min-h-[3em]">
                {analysisText}
                {visible && analysisText.length < analysis.length && (
                  <span className="inline-block w-0.5 h-3.5 bg-white/70 ml-0.5 animate-pulse" />
                )}
              </p>
            </div>
          </div>
        </div>

        {/* 分隔线 */}
        <div className="my-4 h-[0.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* 营养摄入详情 - 能量条 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="text-xs opacity-70 mb-3 font-medium">营养摄入详情</div>
          <div className="grid grid-cols-4 gap-0">
            {nutrients.map((n, i) => {
              const percent = Math.min((n.value / n.max) * 100, 100);
              const count = useCountUp(n.value, 600, visible, 500 + i * 80);
              const staggerDelay = 500 + i * 80;

              return (
                <div
                  key={n.label}
                  className={cn(
                    "flex flex-col items-center transition-all duration-500",
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  )}
                  style={{ transitionDelay: visible ? `${staggerDelay}ms` : "0ms" }}
                >
                  <span className="text-[10px] tracking-widest opacity-60 uppercase font-medium mb-1.5">
                    {n.label}
                  </span>
                  <span className="text-2xl font-semibold leading-none tabular-nums">
                    {count}
                  </span>
                  <span className="text-[10px] opacity-50 mt-0.5 mb-3">{n.unit}</span>
                  <div className="w-10 h-[2px] bg-white/20 rounded-full overflow-hidden relative">
                    <div
                      className={cn("h-full rounded-full transition-all ease-out relative", n.color)}
                      style={{
                        width: visible ? `${percent}%` : "0%",
                        transitionDuration: "1000ms",
                        transitionDelay: `${staggerDelay + 300}ms`,
                      }}
                    >
                      <div
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full opacity-0"
                        style={{
                          backgroundColor: n.glowColor,
                          boxShadow: `0 0 6px 2px ${n.glowColor}`,
                          animation: visible
                            ? `glow-pulse 1.2s ease-out ${staggerDelay + 400}ms forwards`
                            : "none",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes glow-pulse {
          0% { opacity: 0; }
          30% { opacity: 0.9; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
