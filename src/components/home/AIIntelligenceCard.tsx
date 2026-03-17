import { Sparkles, Lock, RefreshCw, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

interface AIIntelligenceCardProps {
  className?: string;
}

function useTypewriter(text: string, start: boolean, speed = 25, delay = 300) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!start) return;
    setDisplayed("");
    const timer = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, start, speed, delay]);
  return displayed;
}

export function AIIntelligenceCard({ className }: AIIntelligenceCardProps) {
  const [visible, setVisible] = useState(false);
  const [suggestion, setSuggestion] = useState("分析你的饮食与断食数据，生成个性化健康建议...");
  const [confidence, setConfidence] = useState(0);
  const [basis, setBasis] = useState("正在加载");
  const [fetching, setFetching] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();
  const { profile } = useProfile();
  const isPro = profile?.is_pro ?? false;

  const fetchInsight = useCallback(async () => {
    if (!isAuthenticated) return;
    setFetching(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await supabase.functions.invoke('ai-insights', {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (resp.data) {
        setSuggestion(resp.data.suggestion);
        setConfidence(resp.data.confidence);
        setBasis(resp.data.basis);
      }
    } catch (e) {
      console.error('Failed to fetch AI insights:', e);
    } finally {
      setFetching(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
          fetchInsight();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [fetchInsight]);

  const displayedText = useTypewriter(suggestion, visible && !fetching, 20, 400);

  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-2xl overflow-hidden shadow-card transition-all duration-700",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--ai-gradient-start))] via-[hsl(var(--ai-gradient-end))] to-primary opacity-90" />
      <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10 p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm">AI 智能洞察</span>
          </div>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {confidence}% 置信度
          </span>
        </div>

        <p className="text-sm leading-relaxed opacity-95 min-h-[3em]">
          {fetching ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3 h-3 animate-spin" />
              正在分析...
            </span>
          ) : (
            <>
              {displayedText}
              {visible && displayedText.length < suggestion.length && (
                <span className="inline-block w-0.5 h-3.5 bg-white/70 ml-0.5 animate-pulse" />
              )}
            </>
          )}
        </p>

        <p className="text-[11px] opacity-60 mt-2">{basis}</p>

        <div className="flex items-center gap-2 mt-3">
          <button onClick={fetchInsight} disabled={fetching}
            className="px-3 py-1.5 bg-white/20 rounded-xl text-xs font-medium backdrop-blur-sm hover:bg-white/30 transition-colors">
            {fetching ? "分析中..." : "刷新洞察"}
          </button>
          {isPro ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-white/15 backdrop-blur-sm">
              <Crown className="w-3 h-3" />
              Pro 无限洞察
            </span>
          ) : (
            <button className="px-3 py-1.5 bg-white/10 rounded-xl text-xs font-medium backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center gap-1">
              <Lock className="w-3 h-3" />
              升级 Pro
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
