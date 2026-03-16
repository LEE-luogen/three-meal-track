import { motion } from "framer-motion";

interface HomeHeaderProps {
  userName?: string;
  dateLabel?: string;
}

export function HomeHeader({ userName = "李", dateLabel = "周六 · 1月25日" }: HomeHeaderProps) {
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
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
        {userName}
      </div>
    </motion.div>
  );
}
