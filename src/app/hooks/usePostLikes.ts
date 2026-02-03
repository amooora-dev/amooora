import { useState, useEffect } from 'react';
import { checkPostLike, togglePostLike } from '../services/community';

interface UsePostLikesOptions {
  postId: string;
  userId?: string;
  authorName?: string;
}

export const usePostLikes = (options: UsePostLikesOptions) => {
  const { postId, userId, authorName } = options;
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadLikeStatus = async () => {
      try {
        setLoading(true);
        const liked = await checkPostLike(postId, userId);
        setIsLiked(liked);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar status de like:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    };

    loadLikeStatus();
  }, [postId, userId]);

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
