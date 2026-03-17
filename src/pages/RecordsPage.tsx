import { useState } from "react";
import { Filter, ChevronLeft, ChevronRight, Clock, Flame, TrendingDown, Lock } from "lucide-react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { cn } from "@/lib/utils";
import { useMeals } from "@/hooks/useMeals";
import { useFasting } from "@/hooks/useFasting";
import { useWeightLogs } from "@/hooks/useWeightLogs";
import { useAchievements } from "@/hooks/useAchievements";

const TABS = ["餐食", "断食", "健康", "成就"] as const;
type TabType = typeof TABS[number];

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("餐食");
  const [dateOffset, setDateOffset] = useState(0);

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + dateOffset);
  const dateStr = targetDate.toISOString().split("T")[0];
  const dateLabel = targetDate.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
  const isToday = dateOffset === 0;

  const { meals, loading: mealsLoading } = useMeals(dateStr);
  const { history, totalFastingHours, completedCount, streakDays } = useFasting();
  const { logs: weightLogs, currentWeight, weightChange } = useWeightLogs();
  const { achievements, unlockedCount, totalCount } = useAchievements();

  return (
    <div className="min-h-screen bg-background pb-24 page-enter">
      <div className="h-12" />
      <div className="px-4 max-w-md mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">记录</h1>
          <button className="p-2 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-shadow">
            <Filter className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex gap-1 bg-muted p-1 rounded-2xl">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-xl transition-all duration-normal",
                activeTab === tab ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 餐食 Tab */}
        {activeTab === "餐食" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-center gap-4 bg-card rounded-2xl py-3 shadow-card">
              <button onClick={() => setDateOffset(d => d - 1)} className="p-1 rounded-lg hover:bg-muted transition-colors">
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <span className="text-sm font-semibold text-foreground">
                {isToday ? "今天" : ""} · {dateLabel}
              </span>
              <button onClick={() => setDateOffset(d => Math.min(d + 1, 0))} className="p-1 rounded-lg hover:bg-muted transition-colors">
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {mealsLoading ? (
              <div className="text-center py-8 text-muted-foreground text-sm">加载中...</div>
            ) : meals.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">暂无记录</div>
            ) : (
              <div className="space-y-3">
                {meals.map((meal, i) => {
                  const colorMap: Record<string, string> = { breakfast: "breakfast", lunch: "lunch", dinner: "dinner", snack: "primary" };
                  const typeMap: Record<string, string> = { breakfast: "早餐", lunch: "午餐", dinner: "晚餐", snack: "加餐" };
                  return (
                    <div key={meal.id} className="bg-card rounded-2xl p-4 shadow-card card-hover flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `hsl(var(--${colorMap[meal.meal_type] || "primary"}))` }} />
                        {i < meals.length - 1 && <div className="w-0.5 h-8 bg-border mt-1" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(meal.eaten_at).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            <span className="text-xs font-medium text-foreground">{typeMap[meal.meal_type] || meal.meal_type}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{meal.calories || 0} kcal</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{meal.name}</p>
                        {meal.tags && meal.tags.length > 0 && (
                          <div className="flex gap-1.5 mt-1.5">
                            {meal.tags.map((tag) => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 断食 Tab */}
        {activeTab === "断食" && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card rounded-2xl p-3 shadow-card text-center">
                <p className="text-2xl font-bold text-foreground">{Math.round(totalFastingHours)}</p>
                <p className="text-[10px] text-muted-foreground">总时长(h)</p>
              </div>
              <div className="bg-card rounded-2xl p-3 shadow-card text-center">
                <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                <p className="text-[10px] text-muted-foreground">完成次数</p>
              </div>
              <div className="bg-card rounded-2xl p-3 shadow-card text-center">
                <p className="text-2xl font-bold text-primary">{streakDays}</p>
                <p className="text-[10px] text-muted-foreground">连续天数</p>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">暂无断食记录</div>
            ) : (
              <div className="space-y-2">
                {history.map((record) => (
                  <div key={record.id} className="bg-card rounded-2xl p-3 shadow-card card-hover flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center",
                        (record.completion_rate || 0) >= 100 ? "bg-primary/10" : "bg-warning/10"
                      )}>
                        <Clock className={cn("w-4 h-4", (record.completion_rate || 0) >= 100 ? "text-primary" : "text-warning")} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">
                          {new Date(record.started_at).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" })}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">
                            {record.actual_hours ? `${Math.floor(record.actual_hours)}h ${Math.round((record.actual_hours % 1) * 60)}m` : "--"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">/ {record.target_hours}h</span>
                        </div>
                      </div>
                    </div>
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-medium",
                      (record.completion_rate || 0) >= 100 ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
                    )}>
                      {(record.completion_rate || 0) >= 100 ? "已完成" : `${record.completion_rate || 0}%`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 健康 Tab */}
        {activeTab === "健康" && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-card rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">体重趋势</span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold text-foreground">
                  {currentWeight ? currentWeight.toFixed(1) : "--"}
                </span>
                <span className="text-sm text-muted-foreground">kg</span>
                {weightChange !== null && (
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full font-medium",
                    weightChange <= 0 ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
                  )}>
                    {weightChange > 0 ? "+" : ""}{weightChange.toFixed(1)} kg
                  </span>
                )}
              </div>
              {weightLogs.length > 1 ? (
                <svg viewBox="0 0 280 60" className="w-full h-14" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {(() => {
                    const reversed = [...weightLogs].reverse();
                    const min = Math.min(...reversed.map(l => l.weight_kg));
                    const max = Math.max(...reversed.map(l => l.weight_kg));
                    const range = max - min || 1;
                    const points = reversed.map((l, i) => {
                      const x = (i / (reversed.length - 1)) * 272 + 4;
                      const y = 55 - ((l.weight_kg - min) / range) * 50;
                      return `${x} ${y}`;
                    });
                    const line = `M ${points.join(" L ")}`;
                    const area = `${line} L 276 60 L 4 60 Z`;
                    return (
                      <>
                        <path d={area} fill="url(#healthGrad)" />
                        <path d={line} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
                        <circle cx={points[points.length - 1]?.split(" ")[0]} cy={points[points.length - 1]?.split(" ")[1]} r="3" fill="hsl(var(--primary))" />
                      </>
                    );
                  })()}
                </svg>
              ) : (
                <div className="text-center py-4 text-sm text-muted-foreground">记录体重以查看趋势</div>
              )}
            </div>

            <div className="bg-card rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4 text-warning" />
                <span className="text-sm font-semibold text-foreground">断食统计</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-xl p-3">
                  <span className="text-[10px] text-muted-foreground">总断食时长</span>
                  <div className="text-xl font-bold text-foreground mt-0.5">{Math.round(totalFastingHours)}h</div>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <span className="text-[10px] text-muted-foreground">完成次数</span>
                  <div className="text-xl font-bold text-foreground mt-0.5">{completedCount}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 成就 Tab */}
        {activeTab === "成就" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">已解锁 {unlockedCount}/{totalCount}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={cn(
                    "bg-card rounded-2xl p-3 shadow-card flex flex-col items-center text-center relative overflow-hidden",
                    !achievement.unlocked && "opacity-50"
                  )}
                >
                  {!achievement.unlocked && (
                    <div className="absolute top-1.5 right-1.5">
                      <Lock className="w-3 h-3 text-muted-foreground" />
                    </div>
                  )}
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <span className="text-[11px] font-medium text-foreground leading-tight">{achievement.name}</span>
                  <span className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{achievement.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  );
}
