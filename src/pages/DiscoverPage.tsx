import { useState } from "react";
import { Search, MapPin, Truck, ChefHat, ShoppingCart, Heart, MessageCircle, Share2, Star, Trophy, Users } from "lucide-react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { cn } from "@/lib/utils";

const TABS = ["推荐", "社区", "话题", "挑战"] as const;
type TabType = typeof TABS[number];

// Mock data
const recommendations = [
  { name: "轻食沙拉专门店", rating: 4.8, distance: "1.2km", tags: ["高蛋白", "低升糖"], reason: "适合开食后第一餐" },
  { name: "谷物实验室", rating: 4.6, distance: "0.8km", tags: ["全谷物", "高纤维"], reason: "营养均衡之选" },
  { name: "鲜蒸活鱼馆", rating: 4.9, distance: "2.1km", tags: ["优质蛋白", "低脂"], reason: "补充优质蛋白" },
];

const communityPosts = [
  { user: "小鱼", avatar: "🐟", content: "坚持18:6一周了，感觉精力比之前好很多！体重也下降了1.2kg", likes: 42, comments: 8, time: "2小时前" },
  { user: "健康达人", avatar: "💪", content: "今天试了一道低卡餐：鸡胸肉藜麦碗，只有380卡，饱腹感超强", likes: 67, comments: 15, time: "4小时前" },
  { user: "断食新手", avatar: "🌱", content: "第一次完成16小时断食，好激动！身体适应得比想象中好", likes: 28, comments: 5, time: "6小时前" },
];

const topics = [
  { tag: "#新手入门", posts: 1284, color: "primary" },
  { tag: "#18小时挑战", posts: 856, color: "warning" },
  { tag: "#健康食谱", posts: 2341, color: "lunch" },
  { tag: "#断食科学", posts: 643, color: "accent" },
  { tag: "#体重管理", posts: 1122, color: "dinner" },
  { tag: "#代谢提升", posts: 478, color: "phase-3" },
];

const challenges = [
  { title: "7天断食挑战赛", participants: 128, daysLeft: 5, progress: 30 },
  { title: "21天健康饮食打卡", participants: 256, daysLeft: 14, progress: 33 },
  { title: "本月最佳断食者", participants: 89, daysLeft: 20, progress: 10 },
];

const SCENES = [
  { icon: MapPin, label: "到店吃" },
  { icon: Truck, label: "点外卖" },
  { icon: ChefHat, label: "居家做" },
  { icon: ShoppingCart, label: "超市买" },
] as const;

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<TabType>("推荐");
  const [activeScene, setActiveScene] = useState(0);

  return (
    <div className="min-h-screen bg-background pb-24 page-enter">
      <div className="h-12" />

      <div className="px-4 max-w-md mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">发现</h1>
          <button className="p-2 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-shadow">
            <Search className="w-5 h-5 text-muted-foreground" />
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
        {activeTab === "推荐" && (
          <div className="space-y-4 animate-fade-in">
            {/* Scene selector */}
            <div className="grid grid-cols-4 gap-2">
              {SCENES.map((scene, i) => {
                const Icon = scene.icon;
                return (
                  <button
                    key={scene.label}
                    onClick={() => setActiveScene(i)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all press-scale",
                      activeScene === i
                        ? "bg-primary/10 text-primary"
                        : "bg-card text-muted-foreground shadow-card"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[11px] font-medium">{scene.label}</span>
                  </button>
                );
              })}
            </div>

            {/* AI recommendations */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-warning" />
                <span className="text-sm font-semibold text-foreground">今日最佳推荐</span>
              </div>

              {recommendations.map((item, i) => (
                <div
                  key={item.name}
                  className="bg-card rounded-2xl p-4 shadow-card card-hover animate-card-appear"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 text-warning fill-warning" />
                          <span className="text-xs text-foreground font-medium">{item.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">· {item.distance}</span>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                      <Heart className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "社区" && (
          <div className="space-y-3 animate-fade-in">
            {communityPosts.map((post, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-4 shadow-card card-hover"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                    {post.avatar}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">{post.user}</span>
                    <span className="text-[10px] text-muted-foreground ml-2">{post.time}</span>
                  </div>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed mb-3">{post.content}</p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span className="text-xs">分享</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "话题" && (
          <div className="grid grid-cols-2 gap-3 animate-fade-in">
            {topics.map((topic) => (
              <div
                key={topic.tag}
                className="bg-card rounded-2xl p-4 shadow-card card-hover press-scale"
              >
                <span className="text-sm font-semibold text-foreground">{topic.tag}</span>
                <p className="text-[11px] text-muted-foreground mt-1">{topic.posts} 篇讨论</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "挑战" && (
          <div className="space-y-3 animate-fade-in">
            {challenges.map((challenge, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-4 shadow-card card-hover"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-warning" />
                  <h3 className="text-sm font-semibold text-foreground">{challenge.title}</h3>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {challenge.participants} 人参与
                  </span>
                  <span>剩余 {challenge.daysLeft} 天</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
                <button className="w-full py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity press-scale">
                  立即参与
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
