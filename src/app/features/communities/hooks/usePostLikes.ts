import { useState, useEffect } from 'react';
import { checkPostLike, togglePostLike } from '../services/community';
import { useAuth } from '../../../shared/hooks';

interface UsePostLikesOptions {
  postId: string;
  userId?: string;
  authorName?: string;
}

export const usePostLikes = (options: UsePostLikesOptions) => {
  const { postId, userId, authorName } = options;
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Se não estiver autenticado e não tiver userId, não verificar like
    // Apenas usar localStorage para verificar se já curtiu antes
    if (!isAuthenticated && !userId) {
      try {
        const likedPosts = JSON.parse(localStorage.getItem('amooora_post_likes') || '[]');
        setIsLiked(likedPosts.includes(postId));
      } catch (err) {
        setIsLiked(false);
      } finally {
        setLoading(false);
      }
      return;
    }

    const loadLikeStatus = async () => {
      try {
        setLoading(true);
        const liked = await checkPostLike(postId, userId);
        setIsLiked(liked);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar status de like:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
        setIsLiked(false);
      } finally {
        setLoading(false);
      }
    };

    loadLikeStatus();
  }, [postId, userId, isAuthenticated]);

  const toggleLike = async () => {
    try {
      setLoading(true);
      const result = await togglePostLike(postId, userId, authorName);
      setIsLiked(result.liked);
      setLikesCount(result.likesCount);
      setError(null);
    } catch (err) {
      console.error('Erro ao alternar like:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  return {
    isLiked,
    likesCount,
    loading,
    error,
    toggleLike,
    setLikesCount, // Permitir definir contador externamente
  };
};
