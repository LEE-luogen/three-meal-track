import { useEffect, useState } from 'react';

interface FastingCompleteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fastingDuration: { hours: number; minutes: number };
  targetHours: number;
  planType: string;
  newBadge?: { id: string; name: string; icon: string } | null;
  onStartEating: () => void;
  onViewDetails: () => void;
}

// 星星组件
function FallingStar({ delay, left }: { delay: number; left: number }) {
  return (
    <div
      className="absolute text-2xl animate-star-fall"
      style={{
        left: `${left}%`,
        top: '-20px',
        animationDelay: `${delay}ms`,
      }}
    >
      ⭐
    </div>
  );
}

export function FastingCompleteSheet({
  open,
  onOpenChange,
  fastingDuration,
  targetHours,
  planType,
  newBadge,
  onStartEating,
  onViewDetails,
}: FastingCompleteSheetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [stars, setStars] = useState<{ id: number; delay: number; left: number }[]>([]);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      // 生成随机星星
      const newStars = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        delay: i * 200,
        left: 15 + Math.random() * 70,
      }));
      setStars(newStars);
    } else {
      setIsVisible(false);
    }
  }, [open]);

  if (!open) return null;

  const completionRate = Math.min(
    100,
    Math.round(((fastingDuration.hours * 60 + fastingDuration.minutes) / (targetHours * 60)) * 100)
  );

  const formatDuration = () => {
    const hours = fastingDuration.hours;
    const minutes = fastingDuration.minutes;
    return `${hours}小时${minutes.toString().padStart(2, '0')}分钟`;
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-background transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* 星星动画区域 */}
      <div className="absolute inset-x-0 top-0 h-32 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <FallingStar key={star.id} delay={star.delay} left={star.left} />
        ))}
      </div>

      {/* 主内容 */}
      <div className="flex flex-col h-full px-6 pt-20 pb-8">
        {/* 标题区域 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">🎉 断食完成！</h1>
          <p className="text-muted-foreground text-lg">
            恭喜你完成了 {planType} 断食计划
          </p>
        </div>

        {/* 核心数据卡片 */}
        <div className="bg-card rounded-2xl p-6 shadow-card mb-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">本次断食时长</p>
            <p className="text-3xl font-bold text-foreground mb-4">{formatDuration()}</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">完成率</span>
              <span className="text-2xl font-bold text-primary">{completionRate}%</span>
            </div>
          </div>
        </div>

        {/* 勋章奖励卡片（条件渲染） */}
        {newBadge && (
          <div className="bg-breakfast-light rounded-2xl p-4 mb-4 border border-breakfast/20">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{newBadge.icon}</span>
              <div>
                <p className="text-sm text-breakfast-foreground/70">解锁新勋章</p>
                <p className="font-semibold text-breakfast-foreground">{newBadge.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* 鼓励文案 */}
        <div className="flex-1 flex items-center justify-center">
          <p className="text-center text-muted-foreground leading-relaxed px-4">
            你的身体已进入深度修复阶段，
            <br />
            细胞正在自我更新。继续保持，健康生活！
          </p>
        </div>

        {/* 底部按钮区域 */}
        <div className="mt-auto space-y-3">
          <button
            onClick={onViewDetails}
            className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            查看详情
          </button>
          <button
            onClick={onStartEating}
            className="w-full py-4 bg-foreground text-background rounded-2xl font-medium hover:opacity-90 transition-opacity"
          >
            开始进食
          </button>
        </div>
      </div>
    </div>
  );
}
