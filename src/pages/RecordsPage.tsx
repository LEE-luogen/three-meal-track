import { useState } from "react";
import { Filter, ChevronLeft, ChevronRight, Clock, Flame, TrendingDown, Trophy, Lock } from "lucide-react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { cn } from "@/lib/utils";

const TABS = ["餐食", "断食", "健康", "成就"] as const;
type TabType = typeof TABS[number];

// Mock data
const mealRecords = [
  { time: "07:21", type: "早餐", name: "牛油果鸡蛋吐司", calories: 275, tags: ["高蛋白", "优质脂肪"], color: "breakfast" },
  { time: "12:35", type: "午餐", name: "鸡胸肉藜麦沙拉", calories: 510, tags: ["低升糖", "高纤维"], color: "lunch" },
];

const fastingHistory = [
  { date: "3/16", hours: 16, minutes: 2, target: 16, completed: true },
  { date: "3/15", hours: 18, minutes: 30, target: 18, completed: true },
  { date: "3/14", hours: 14, minutes: 15, target: 16, completed: false },
  { date: "3/13", hours: 16, minutes: 45, target: 16, completed: true },
  { date: "3/12", hours: 12, minutes: 0, target: 16, completed: false },
  { date: "3/11", hours: 17, minutes: 20, target: 16, completed: true },
  { date: "3/10", hours: 16, minutes: 5, target: 16, completed: true },
];

const achievements = [
  { name: "初次断食", desc: "完成第一次断食", unlocked: true, icon: "🌟" },
  { name: "连续7天", desc: "连续7天完成断食", unlocked: true, icon: "🔥" },
  { name: "断食达人", desc: "累计断食100小时", unlocked: true, icon: "💪" },
  { name: "铁人意志", desc: "完成24小时断食", unlocked: true, icon: "🏆" },
  { name: "社交达人", desc: "首次分享断食成果", unlocked: true, icon: "🤝" },
  { name: "营养专家", desc: "连续7天营养评分>80", unlocked: false, icon: "🥗" },
  { name: "百日坚持", desc: "累计断食100天", unlocked: false, icon: "💎" },
  { name: "完美一周", desc: "一周内全部达标", unlocked: false, icon: "👑" },
  { name: "代谢大师", desc: "代谢灵活性达到优秀", unlocked: false, icon: "⚡" },
  { name: "终极挑战", desc: "完成36小时断食", unlocked: false, icon: "🌙" },
  { name: "数据先锋", desc: "连续30天记录饮食", unlocked: false, icon: "📊" },
  { name: "传说级别", desc: "累计断食1000小时", unlocked: false, icon: "🏅" },
];

const calendarDays = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  completed: [1, 2, 3, 5, 6, 7, 8, 10, 11, 13, 15, 16].includes(i + 1),
  partial: [4, 9, 12, 14].includes(i + 1),
}));

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("餐食");
  const [currentDate] = useState("3月16日");

  return (
    <div className="min-h-screen bg-background pb-24 page-enter">
      <div className="h-12" />

      <div className="px-4 max-w-md mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">记录</h1>
          <button className="p-2 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-shadow">
            <Filter className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 bg-muted p-1 rounded-2xl">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-xl transition-all duration-normal",
                activeTab === tab
                  ? "bg-card text-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "餐食" && (
          <div className="space-y-4 animate-fade-in">
            {/* Date picker */}
            <div className="flex items-center justify-center gap-4 bg-card rounded-2xl py-3 shadow-card">
              <button className="p-1 rounded-lg hover:bg-muted transition-colors">
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <span className="text-sm font-semibold text-foreground">今天 · {currentDate}</span>
              <button className="p-1 rounded-lg hover:bg-muted transition-colors">
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Meal timeline */}
            <div className="space-y-3">
              {mealRecords.map((meal, i) => (
                <div
                  key={i}
                  className="bg-card rounded-2xl p-4 shadow-card card-hover flex items-start gap-3"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: `hsl(var(--${meal.color}))` }}
                    />
                    {i < mealRecords.length - 1 && (
                      <div className="w-0.5 h-8 bg-border mt-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{meal.time}</span>
                        <span className="text-xs font-medium text-foreground">{meal.type}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{meal.calories} kcal</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{meal.name}</p>
                    <div className="flex gap-1.5 mt-1.5">
                      {meal.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "断食" && (
          <div className="space-y-4 animate-fade-in">
            {/* Mini calendar */}
            <div className="bg-card rounded-2xl p-4 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <button className="p-1"><ChevronLeft className="w-4 h-4 text-muted-foreground" /></button>
                <span className="text-sm font-semibold text-foreground">2026年3月</span>
                <button className="p-1"><ChevronRight className="w-4 h-4 text-muted-foreground" /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
                  <span key={d} className="text-[10px] text-muted-foreground py-1">{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {/* Offset for March 2026 starting on Sunday */}
                {calendarDays.slice(0, 28).map((day) => (
                  <div
                    key={day.day}
                    className={cn(
                      "w-full aspect-square rounded-lg flex items-center justify-center text-xs relative",
                      day.completed && "bg-primary/15 text-primary font-medium",
                      day.partial && "bg-warning/10 text-warning",
                      !day.completed && !day.partial && "text-muted-foreground"
                    )}
                  >
                    {day.day}
                    {day.completed && (
                      <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 justify-center">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-[10px] text-muted-foreground">完成</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-warning" />
                  <span className="text-[10px] text-muted-foreground">未完成</span>
                </div>
              </div>
            </div>

            {/* History list */}
            <div className="space-y-2">
              {fastingHistory.map((record, i) => (
                <div
                  key={i}
                  className="bg-card rounded-2xl p-3 shadow-card card-hover flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center",
                      record.completed ? "bg-primary/10" : "bg-warning/10"
                    )}>
                      <Clock className={cn("w-4 h-4", record.completed ? "text-primary" : "text-warning")} />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">{record.date}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {record.hours}h {record.minutes}m
                        </span>
                        <span className="text-[10px] text-muted-foreground">/ {record.target}h</span>
                      </div>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-medium",
                    record.completed
                      ? "bg-primary/10 text-primary"
                      : "bg-warning/10 text-warning"
                  )}>
                    {record.completed ? "已完成" : "未达标"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "健康" && (
          <div className="space-y-4 animate-fade-in">
            {/* Weight chart placeholder */}
            <div className="bg-card rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">体重趋势</span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold text-foreground">71.0</span>
                <span className="text-sm text-muted-foreground">kg</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">-1.5 kg</span>
              </div>
              {/* Simple SVG chart */}
              <svg viewBox="0 0 280 60" className="w-full h-14" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M 4 20 L 50 25 L 96 15 L 142 22 L 188 10 L 234 8 L 276 5 L 276 60 L 4 60 Z" fill="url(#healthGrad)" />
                <path d="M 4 20 L 50 25 L 96 15 L 142 22 L 188 10 L 234 8 L 276 5" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
                <circle cx="276" cy="5" r="3" fill="hsl(var(--primary))" />
              </svg>
            </div>

            {/* Metabolism score */}
            <div className="bg-card rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4 text-warning" />
                <span className="text-sm font-semibold text-foreground">代谢指标</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-xl p-3">
                  <span className="text-[10px] text-muted-foreground">BMI</span>
                  <div className="text-xl font-bold text-foreground mt-0.5">22.5</div>
                  <span className="text-[10px] text-primary">正常</span>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <span className="text-[10px] text-muted-foreground">代谢评分</span>
                  <div className="text-xl font-bold text-foreground mt-0.5">78</div>
                  <span className="text-[10px] text-primary">良好</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "成就" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                已解锁 {achievements.filter(a => a.unlocked).length}/{achievements.length}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.name}
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
                  <span className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{achievement.desc}</span>
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
