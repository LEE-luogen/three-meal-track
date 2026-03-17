import { useState } from "react";
import { Bug, X, ChevronDown, ChevronUp } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { useFastingStore } from "@/stores/fastingStore";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface ActionGroup {
  title: string;
  actions: { label: string; description: string; handler: () => void; active?: boolean }[];
}

export function DebugPanel() {
  const [open, setOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const userStore = useUserStore();
  const fastingStore = useFastingStore();

  const isPro = userStore.userProfile.isPro;

  const groups: ActionGroup[] = [
    {
      title: "👑 Pro 会员",
      actions: [
        {
          label: isPro ? "取消 Pro" : "解锁 Pro",
          description: isPro ? "恢复为免费用户" : "模拟升级为 Pro 会员",
          handler: () => {
            userStore.updateUserProfile({ isPro: !isPro });
            toast({ title: isPro ? "已恢复免费用户" : "已解锁 Pro 会员 👑" });
          },
          active: isPro,
        },
        {
          label: "打开付费墙",
          description: "显示 PaywallModal",
          handler: () => userStore.setShowPaywall(true),
        },
      ],
    },
    {
      title: "⏱️ 断食状态",
      actions: [
        {
          label: "完成断食弹窗",
          description: "触发 FastingCompleteSheet",
          handler: () => fastingStore.setShowFastingComplete(true),
        },
        {
          label: "提前结束确认",
          description: "触发 EarlyEndConfirmDrawer",
          handler: () => fastingStore.setShowEarlyEndConfirm(true),
        },
        {
          label: fastingStore.isFasting ? "停止断食" : "开始断食",
          description: "切换断食中/非断食状态",
          handler: () => {
            if (fastingStore.isFasting) {
              fastingStore.endFasting("debug");
            } else {
              fastingStore.startFasting();
            }
            toast({ title: fastingStore.isFasting ? "断食已停止" : "断食已开始" });
          },
          active: fastingStore.isFasting,
        },
      ],
    },
    {
      title: "🔔 弹窗 & 抽屉",
      actions: [
        {
          label: "设置抽屉",
          description: "打开 SettingsDrawer",
          handler: () => userStore.setShowSettings(true),
        },
        {
          label: "编辑资料",
          description: "打开 EditProfileModal",
          handler: () => userStore.setShowEditProfile(true),
        },
        {
          label: "隐私政策",
          description: "打开 PrivacyModal",
          handler: () => userStore.setShowPrivacy(true),
        },
        {
          label: "联系我们",
          description: "打开 ContactModal",
          handler: () => userStore.setShowContact(true),
        },
        {
          label: "清空数据确认",
          description: "打开 ClearDataModal",
          handler: () => userStore.setShowClearDataConfirm(true),
        },
      ],
    },
    {
      title: "📸 拍照 & AI",
      actions: [
        {
          label: "打开相机",
          description: "触发 CameraModal",
          handler: () => userStore.setShowCamera(true),
        },
        {
          label: "设置免费分析次数",
          description: "设为 0 次（触发限制提示）",
          handler: () => {
            userStore.updateUserProfile({ remainingFreeAnalyses: 0 });
            toast({ title: "免费分析次数已设为 0" });
          },
        },
        {
          label: "重置免费分析次数",
          description: "恢复为 3 次",
          handler: () => {
            userStore.updateUserProfile({ remainingFreeAnalyses: 3 });
            toast({ title: "免费分析次数已恢复为 3" });
          },
        },
      ],
    },
    {
      title: "🧹 重置",
      actions: [
        {
          label: "重置所有状态",
          description: "恢复 userStore 到初始值",
          handler: () => {
            userStore.resetAll();
            toast({ title: "所有状态已重置", description: "用户数据已恢复初始值" });
          },
        },
      ],
    },
  ];

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-28 right-4 z-[9999] w-12 h-12 rounded-full bg-foreground text-background shadow-xl flex items-center justify-center press-scale hover:opacity-90 transition-opacity"
      >
        <Bug className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-md bg-card rounded-t-3xl shadow-2xl max-h-[75vh] flex flex-col animate-card-appear">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">交互测试面板</span>
          </div>
          <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Status bar */}
        <div className="px-5 py-2.5 bg-muted/50 flex items-center gap-3 text-[11px] text-muted-foreground border-b border-border">
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", isPro ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
            {isPro ? "Pro 会员" : "免费用户"}
          </span>
          <span>{fastingStore.isFasting ? "🟢 断食中" : "⚪ 未断食"}</span>
          <span>AI 分析: {userStore.userProfile.remainingFreeAnalyses} 次</span>
        </div>

        {/* Action groups */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
          {groups.map((group) => {
            const isExpanded = expandedGroup === group.title;
            return (
              <div key={group.title} className="rounded-2xl border border-border overflow-hidden">
                <button
                  onClick={() => setExpandedGroup(isExpanded ? null : group.title)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium">{group.title}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 space-y-1.5">
                    {group.actions.map((action) => (
                      <button
                        key={action.label}
                        onClick={action.handler}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-xl transition-colors flex items-center justify-between group",
                          action.active
                            ? "bg-primary/10 hover:bg-primary/15"
                            : "bg-muted/40 hover:bg-muted"
                        )}
                      >
                        <div>
                          <div className="text-xs font-medium text-foreground">{action.label}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{action.description}</div>
                        </div>
                        {action.active && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
