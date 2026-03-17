import { useState } from "react";
import { Search, MapPin, Truck, ChefHat, ShoppingCart, Heart, MessageCircle, Share2, Star, Trophy, Users, Send, Plus } from "lucide-react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { cn } from "@/lib/utils";
import { usePosts } from "@/hooks/usePosts";
import { useChallenges } from "@/hooks/useChallenges";
import { useAuth } from "@/hooks/useAuth";

const TABS = ["推荐", "社区", "话题", "挑战"] as const;
type TabType = typeof TABS[number];

const recommendations = [
  { name: "轻食沙拉专门店", rating: 4.8, distance: "1.2km", tags: ["高蛋白", "低升糖"], reason: "适合开食后第一餐" },
  { name: "谷物实验室", rating: 4.6, distance: "0.8km", tags: ["全谷物", "高纤维"], reason: "营养均衡之选" },
  { name: "鲜蒸活鱼馆", rating: 4.9, distance: "2.1km", tags: ["优质蛋白", "低脂"], reason: "补充优质蛋白" },
];

const topics = [
  { tag: "#新手入门", posts: 1284 },
  { tag: "#18小时挑战", posts: 856 },
  { tag: "#健康食谱", posts: 2341 },
  { tag: "#断食科学", posts: 643 },
  { tag: "#体重管理", posts: 1122 },
  { tag: "#代谢提升", posts: 478 },
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
  const [newPostContent, setNewPostContent] = useState("");
  const [showPostForm, setShowPostForm] = useState(false);

  const { posts, loading: postsLoading, createPost, toggleLike } = usePosts();
  const { challenges, loading: challengesLoading, joinChallenge } = useChallenges();
  const { user } = useAuth();

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    await createPost(newPostContent.trim());
    setNewPostContent("");
    setShowPostForm(false);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    return `${Math.floor(hours / 24)}天前`;
  };

  return (
    <div className="min-h-screen bg-background pb-24 page-enter">
      <div className="h-12" />
      <div className="px-4 max-w-md mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">发现</h1>
          <button className="p-2 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-shadow">
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex gap-1 bg-muted p-1 rounded-2xl">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-xl transition-all duration-normal",
                activeTab === tab ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 推荐 Tab - stays as mock data for now */}
        {activeTab === "推荐" && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-4 gap-2">
              {SCENES.map((scene, i) => {
                const Icon = scene.icon;
                return (
                  <button key={scene.label} onClick={() => setActiveScene(i)}
                    className={cn("flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all press-scale",
                      activeScene === i ? "bg-primary/10 text-primary" : "bg-card text-muted-foreground shadow-card"
                    )}>
                    <Icon className="w-5 h-5" />
                    <span className="text-[11px] font-medium">{scene.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-warning" />
                <span className="text-sm font-semibold text-foreground">今日最佳推荐</span>
              </div>
              {recommendations.map((item, i) => (
                <div key={item.name} className="bg-card rounded-2xl p-4 shadow-card card-hover animate-card-appear" style={{ animationDelay: `${i * 100}ms` }}>
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
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{tag}</span>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 社区 Tab - real data */}
        {activeTab === "社区" && (
          <div className="space-y-3 animate-fade-in">
            {/* New post button */}
            {!showPostForm ? (
              <button onClick={() => setShowPostForm(true)}
                className="w-full bg-card rounded-2xl p-4 shadow-card flex items-center gap-3 text-muted-foreground hover:bg-muted/50 transition-colors">
                <Plus className="w-5 h-5" />
                <span className="text-sm">分享你的断食心得...</span>
              </button>
            ) : (
              <div className="bg-card rounded-2xl p-4 shadow-card space-y-3">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="分享你的断食心得..."
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[80px]"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => { setShowPostForm(false); setNewPostContent(""); }}
                    className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">取消</button>
                  <button onClick={handleCreatePost}
                    className="px-4 py-1.5 bg-primary text-primary-foreground rounded-xl text-xs font-medium press-scale flex items-center gap-1">
                    <Send className="w-3 h-3" /> 发布
                  </button>
                </div>
              </div>
            )}

            {postsLoading ? (
              <div className="text-center py-8 text-muted-foreground text-sm">加载中...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">暂无帖子，来发第一条吧！</div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-card rounded-2xl p-4 shadow-card card-hover">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs text-primary-foreground font-medium">
                      {(post.author_nickname || "?").charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">{post.author_nickname}</span>
                      <span className="text-[10px] text-muted-foreground ml-2">{timeAgo(post.created_at)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed mb-3">{post.content}</p>
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleLike(post.id, post.liked_by_me || false)}
                      className={cn("flex items-center gap-1 transition-colors",
                        post.liked_by_me ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                      )}>
                      <Heart className={cn("w-4 h-4", post.liked_by_me && "fill-current")} />
                      <span className="text-xs">{post.likes_count}</span>
                    </button>
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs">{post.comments_count}</span>
                    </button>
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span className="text-xs">分享</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 话题 Tab */}
        {activeTab === "话题" && (
          <div className="grid grid-cols-2 gap-3 animate-fade-in">
            {topics.map((topic) => (
              <div key={topic.tag} className="bg-card rounded-2xl p-4 shadow-card card-hover press-scale">
                <span className="text-sm font-semibold text-foreground">{topic.tag}</span>
                <p className="text-[11px] text-muted-foreground mt-1">{topic.posts} 篇讨论</p>
              </div>
            ))}
          </div>
        )}

        {/* 挑战 Tab - real data */}
        {activeTab === "挑战" && (
          <div className="space-y-3 animate-fade-in">
            {challengesLoading ? (
              <div className="text-center py-8 text-muted-foreground text-sm">加载中...</div>
            ) : challenges.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">暂无进行中的挑战</div>
            ) : (
              challenges.map((challenge) => {
                const daysLeft = Math.max(0, Math.ceil((new Date(challenge.ends_at).getTime() - Date.now()) / 86400000));
                return (
                  <div key={challenge.id} className="bg-card rounded-2xl p-4 shadow-card card-hover">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-warning" />
                      <h3 className="text-sm font-semibold text-foreground">{challenge.title}</h3>
                    </div>
                    {challenge.description && (
                      <p className="text-xs text-muted-foreground mb-2">{challenge.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {challenge.participants_count} 人参与
                      </span>
                      <span>剩余 {daysLeft} 天</span>
                    </div>
                    {challenge.joined && (
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${challenge.my_progress}%` }} />
                      </div>
                    )}
                    <button
                      onClick={() => !challenge.joined && joinChallenge(challenge.id)}
                      disabled={challenge.joined}
                      className={cn(
                        "w-full py-2 rounded-xl text-sm font-medium transition-opacity press-scale",
                        challenge.joined
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary text-primary-foreground hover:opacity-90"
                      )}
                    >
                      {challenge.joined ? "已参与" : "立即参与"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  );
}
