import { ClipboardList, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

interface QuickActionBarProps {
  className?: string;
}

export function QuickActionBar({ className }: QuickActionBarProps) {
  const actions: QuickAction[] = [
    { icon: ClipboardList, label: "补录" },
    { icon: History, label: "历史" },
    { icon: Settings, label: "设置" },
  ];

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={action.onClick}
            className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-card shadow-card card-hover press-scale"
          >
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-[11px] text-muted-foreground">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}
