import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_urls: string[];
  topic_tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  // Joined
  author_nickname?: string;
  author_avatar?: string;
  liked_by_me?: boolean;
}

export interface PostComment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  author_nickname?: string;
}

export function usePosts(topicFilter?: string) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('posts')
      .select('*, profiles!posts_user_id_fkey(nickname, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (topicFilter) {
      query = query.contains('topic_tags', [topicFilter]);
    }

    const { data } = await query;

    // Check which posts are liked by current user
    let likedPostIds = new Set<string>();
    if (user && data && data.length > 0) {
      const { data: likes } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', data.map(p => p.id));
      likedPostIds = new Set((likes || []).map(l => l.post_id));
    }

    const mapped = (data || []).map((p: any) => ({
      id: p.id,
      user_id: p.user_id,
      content: p.content,
      image_urls: p.image_urls || [],
      topic_tags: p.topic_tags || [],
      likes_count: p.likes_count,
      comments_count: p.comments_count,
      created_at: p.created_at,
      author_nickname: p.profiles?.nickname || '匿名用户',
      author_avatar: p.profiles?.avatar_url,
      liked_by_me: likedPostIds.has(p.id),
    }));
    setPosts(mapped);
    setLoading(false);
  }, [user, topicFilter]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const createPost = useCallback(async (content: string, topicTags: string[] = [], imageUrls: string[] = []) => {
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase.from('posts').insert({
      user_id: user.id,
      content,
      topic_tags: topicTags,
      image_urls: imageUrls,
    });
    if (!error) await fetchPosts();
    return { error: error?.message ?? null };
  }, [user, fetchPosts]);

  const toggleLike = useCallback(async (postId: string, currentlyLiked: boolean) => {
    if (!user) return;
    if (currentlyLiked) {
      await supabase.from('post_likes').delete().eq('user_id', user.id).eq('post_id', postId);
      // Decrement count
      await supabase.rpc('decrement_post_likes' as any, { post_id_input: postId }).catch(() => {});
    } else {
      await supabase.from('post_likes').insert({ user_id: user.id, post_id: postId });
      await supabase.rpc('increment_post_likes' as any, { post_id_input: postId }).catch(() => {});
    }
    await fetchPosts();
  }, [user, fetchPosts]);

  const addComment = useCallback(async (postId: string, content: string) => {
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase.from('post_comments').insert({
      user_id: user.id,
      post_id: postId,
      content,
    });
    if (!error) {
      // Increment comments count
      await supabase.rpc('increment_post_comments' as any, { post_id_input: postId }).catch(() => {});
      await fetchPosts();
    }
    return { error: error?.message ?? null };
  }, [user, fetchPosts]);

  return { posts, loading, createPost, toggleLike, addComment, refetch: fetchPosts };
}
