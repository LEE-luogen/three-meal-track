import { Home, Compass, Camera, BarChart3, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/userStore";

const NAV_ITEMS = [
  { path: "/", icon: Home, label: "首页" },
  { path: "/discover", icon: Compass, label: "发现" },
  { path: "__camera__", icon: Camera, label: "" },
  { path: "/records", icon: BarChart3, label: "记录" },
  { path: "/settings", icon: User, label: "我的" },
] as const;

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subscriptionType, setShowCamera, setShowPaywall } = useUserStore();

  const handleCameraClick = () => {
    if (subscriptionType === "free") {
      setShowPaywall(true);
    } else {
      setShowCamera(true);
    }
  };

  // TODO: from store
  const hasUnrecordedMeals = true;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 relative">
        {NAV_ITEMS.map((item) => {
          if (item.path === "__camera__") {
            return (
              <button
                key="camera"
                onClick={handleCameraClick}
                className="absolute left-1/2 -translate-x-1/2 -top-5 w-14 h-14 rounded-full bg-foreground shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 animate-pulse-soft"
              >
                <Camera className="h-6 w-6 text-background" />
                {hasUnrecordedMeals && (
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-card" />
                )}
              </button>
            );
          }

          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 transition-colors min-w-[48px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 transition-all", isActive && "fill-primary/20")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
