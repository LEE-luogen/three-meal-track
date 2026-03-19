import { useState } from "react";
import { Lock, Crown, Brain, TrendingUp, Apple } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { useMeals } from "@/hooks/useMeals";
import { useUserStore } from "@/stores/userStore";

type Tab = "ai" | "nutrition" | "metabolism";

const tabs: { key: Tab; label: string; icon: typeof Brain }[] = [
  { key: "ai", label: "AI 洞察", icon: Brain },
  { key: "nutrition", label: "营养详情", icon: Apple },
  { key: "metabolism", label: "代谢趋势", icon: TrendingUp },
];

function AIInsightsTab() {
  const cards = [
    {
      title: "记忆卡片",
      content: "当前节奏稳定，建议维持补水与轻度活动。",
      bgClass: "bg-[hsl(var(--phase-2)/0.12)]",
      borderClass: "border-[hsl(var(--phase-2)/0.2)]",
    },
    {
      title: "预测卡片",
      content: "预计完成70%：先将16:8稳定到每周5次",
      bgClass: "bg-[hsl(var(--phase-4)/0.12)]",
      borderClass: "border-[hsl(var(--phase-4)/0.2)]",
    },
    {
      title: "洞察卡片",
      content: "今日蛋白质偏低，下一餐可增加鱼、蛋或豆制品。",
      bgClass: "bg-[hsl(var(--muted)/0.5)]",
      borderClass: "border-[hsl(var(--border))]",
    },
  ];

  return (
    <div className="space-y-2.5">
      {cards.map((card) => (
        <div
          key={card.title}
          className={cn(
            "rounded-xl p-3.5 border",
            card.bgClass,
            card.borderClass
          )}
        >
          <p className="text-[10px] text-muted-foreground mb-1">{card.title}</p>
          <p className="text-sm text-foreground leading-relaxed">{card.content}</p>
        </div>
      ))}
    </div>
  );
}

function NutritionTab() {
  const { todayCalories, todayProtein, todayCarbs, todayFat, todayFiber } = useMeals();

  const targets = { calories: 1690, protein: 124, carbs: 143, fat: 52, fiber: 33 };
  const rows = [
    { label: "蛋白质", value: Math.round(todayProtein), target: targets.protein, unit: "g" },
    { label: "碳水", value: Math.round(todayCarbs), target: targets.carbs, unit: "g" },
    { label: "脂肪", value: Math.round(todayFat), target: targets.fat, unit: "g" },
    { label: "纤维", value: Math.round(todayFiber ?? 0), target: targets.fiber, unit: "g" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">实时营养平衡</h4>
        <span className="text-xs text-muted-foreground">
          {Math.round(todayCalories)}/{targets.calories} kcal
        </span>
      </div>

      <div className="space-y-2.5">
        {rows.map((row) => {
          const pct = row.target > 0 ? Math.min(100, (row.value / row.target) * 100) : 0;
          return (
            <div key={row.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="text-foreground font-medium">
                  {row.value}/{row.target}{row.unit}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground pt-1">
        {todayProtein < 30
          ? "今日蛋白质偏低，下一餐可增加鱼、蛋或豆制品。"
          : "营养摄入均衡，继续保持！"}
      </p>
    </div>
  );
}

function MetabolismTab() {
  const metrics = [
    { label: "ISI", value: "0.51", unit: "" },
    { label: "代谢灵活性", value: "96", unit: "" },
    { label: "酮体倾向", value: "53", unit: "" },
  ];

  const details = [
    { label: "insulinSensitivity", change: "-37.8%", negative: true },
    { label: "metabolicFlexibility", change: "+74.5%", negative: false },
    { label: "ketoneTendency", change: "+10.4%", negative: false },
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-foreground">代谢趋势</h4>

      <div className="flex gap-2">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex-1 rounded-xl bg-secondary/50 p-3 text-center"
          >
            <p className="text-[10px] text-muted-foreground mb-1">{m.label}</p>
            <p className="text-lg font-bold text-foreground">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        {details.map((d) => (
          <div key={d.label} className="flex justify-between text-xs">
            <span className="text-muted-foreground">{d.label}</span>
            <span className={cn("font-medium", d.negative ? "text-destructive" : "text-primary")}>
              {d.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NutrientSummary() {
  const { todayProtein, todayCarbs, todayFat, todayFiber } = useMeals();
  const items = [
    { label: "脂肪", value: Math.round(todayFat), unit: "g" },
    { label: "碳水", value: Math.round(todayCarbs), unit: "g" },
    { label: "蛋白质", value: Math.round(todayProtein), unit: "g" },
    { label: "微量元素", value: Math.round(todayFiber ?? 0), unit: "%" },
  ];

  return (
    <div className="flex justify-between py-3 px-2">
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <p className="text-[10px] text-muted-foreground mb-0.5">{item.label}</p>
          <p className="text-xl font-bold text-foreground">{item.value}</p>
          <p className="text-[10px] text-muted-foreground">{item.unit}</p>
        </div>
      ))}
    </div>
  );
}

export function ProInsightsSection({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("ai");
  const { profile } = useProfile();
  const { setShowPaywall } = useUserStore();
  const isPro = profile?.is_pro ?? false;

  const handleUnlock = () => {
    setShowPaywall(true);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Nutrient summary - always visible */}
      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <NutrientSummary />
      </div>

      {/* Pro tabbed section */}
      <div className="bg-card rounded-2xl shadow-card overflow-hidden relative">
        {/* Tab bar */}
        <div className="flex border-b border-border/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => isPro && setActiveTab(tab.key)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors",
                  activeTab === tab.key
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="p-4 min-h-[180px]">
          {activeTab === "ai" && <AIInsightsTab />}
          {activeTab === "nutrition" && <NutritionTab />}
          {activeTab === "metabolism" && <MetabolismTab />}
        </div>

        {/* Pro lock overlay */}
        {!isPro && (
          <div
            className="absolute inset-0 bg-card/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3 cursor-pointer rounded-2xl"
            onClick={handleUnlock}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--pro-gold))] to-[hsl(25,80%,50%)] flex items-center justify-center shadow-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">解锁 Pro 深度洞察</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">AI分析 · 营养详情 · 代谢趋势</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
