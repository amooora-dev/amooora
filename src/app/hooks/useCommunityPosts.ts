import { useState, useEffect, useMemo } from 'react';
import { getCommunityPosts, getPostById } from '../services/community';
import { CommunityPost } from '../types';

interface UseCommunityPostsOptions {
  category?: string;
  searchQuery?: string;
  limit?: number;
}

export const useCommunityPosts = (options: UseCommunityPostsOptions = {}) => {
  const { category, searchQuery, limit = 20 } = options;
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const loadData = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setOffset(0);
      }

      const currentOffset = reset ? 0 : offset;
      const result = await getCommunityPosts(category, limit, currentOffset);

      if (reset) {
        setPosts(result.data);
      } else {
        setPosts((prev) => [...prev, ...result.data]);
      }

      setHasMore(result.hasMore);
      setOffset(currentOffset + result.data.length);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar posts:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, [category]); // Recarregar quando categoria mudar

  // Filtrar por busca textual
  const filteredPosts = useMemo(() => {
    if (!searchQuery?.trim()) {
      return posts;
    }

    const query = searchQuery.toLowerCase().trim();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author?.name.toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  const loadMore = () => {
    if (!loading && hasMore) {
      loadData(false);
    }
  };

  return {
    posts: filteredPosts,
    loading,
    error,
    hasMore,
    loadMore,
    refetch: () => loadData(true),
  };
};

// Hook para buscar um post específico
export const usePost = (postId: string | undefined) => {
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!postId) {
      setLoading(false);
      return;
    }

    const loadPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(postId);
        setPost(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar post:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  return { post, loading, error, refetch: () => postId && getPostById(postId).then(setPost) };
};
