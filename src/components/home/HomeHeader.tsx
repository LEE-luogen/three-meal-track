import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useState } from "react";

interface HomeHeaderProps {
  userName?: string;
  dateLabel?: string;
  unreadCount?: number;
}

export function HomeHeader({ userName = "李", dateLabel = "周六 · 1月25日", unreadCount = 3 }: HomeHeaderProps) {
  const [showMessages, setShowMessages] = useState(false);

  return (
    <motion.div
      className="flex items-center justify-between"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">今日饮食</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{dateLabel}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowMessages(!showMessages)}
          className="relative w-10 h-10 rounded-full bg-card shadow-card flex items-center justify-center hover:bg-muted transition-colors press-scale"
        >
          <Bell className="w-[18px] h-[18px] text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center border-2 border-background">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
          {userName}
        </div>
      </div>
    </motion.div>
  );
}
