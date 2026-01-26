import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUserStore } from "@/stores/userStore";
import { 
  Cloud, 
  Shield, 
  Trash2, 
  MessageCircle,
  ChevronRight,
  CheckCircle2
} from "lucide-react";

export const SettingsDrawer = () => {
  const { 
    showSettings, 
    setShowSettings, 
    authToken,
    setShowPrivacy,
    setShowClearDataConfirm,
    setShowContact,
  } = useUserStore();

  const isSynced = !!authToken;

  const handleGoogleSync = () => {
    // TODO: Implement Google OAuth
    console.log("Google sync clicked");
  };

  const settingsItems = [
    {
      icon: Cloud,
      label: "同步数据",
      sublabel: isSynced ? "已连接 Google" : "使用 Google 同步",
      action: handleGoogleSync,
      rightElement: isSynced ? (
        <CheckCircle2 className="h-5 w-5 text-primary" />
      ) : (
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      ),
    },
    {
      icon: Shield,
      label: "隐私政策",
      sublabel: "查看我们的隐私政策",
      action: () => {
        setShowSettings(false);
        setShowPrivacy(true);
      },
      rightElement: <ChevronRight className="h-5 w-5 text-muted-foreground" />,
    },
    {
      icon: Trash2,
      label: "清空所有数据",
      sublabel: "删除所有本地数据",
      action: () => {
        setShowSettings(false);
        setShowClearDataConfirm(true);
      },
      rightElement: <ChevronRight className="h-5 w-5 text-muted-foreground" />,
      danger: true,
    },
    {
      icon: MessageCircle,
      label: "联系我们",
      sublabel: "获取帮助和反馈",
      action: () => {
        setShowSettings(false);
        setShowContact(true);
      },
      rightElement: <ChevronRight className="h-5 w-5 text-muted-foreground" />,
    },
  ];

  return (
    <Sheet open={showSettings} onOpenChange={setShowSettings}>
      <SheetContent side="bottom" className="rounded-t-3xl px-0 pb-8">
        <SheetHeader className="px-6 pb-4">
          <SheetTitle className="text-center">设置</SheetTitle>
        </SheetHeader>

        <div className="space-y-1 px-4">
          {settingsItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-colors hover:bg-secondary/50 ${
                item.danger ? "text-destructive" : "text-foreground"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                item.danger ? "bg-destructive/10" : "bg-secondary"
              }`}>
                <item.icon className={`h-5 w-5 ${
                  item.danger ? "text-destructive" : "text-foreground"
                }`} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sublabel}</p>
              </div>
              {item.rightElement}
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
