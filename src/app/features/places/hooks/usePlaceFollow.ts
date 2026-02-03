import { useState, useEffect } from 'react';
import { followPlace, unfollowPlace, isFollowingPlace, getPlaceFollowersCount } from '../services/placeFollows';

interface UsePlaceFollowOptions {
  onFollowChange?: () => void;
}

export const usePlaceFollow = (
  placeId: string | undefined,
  options?: UsePlaceFollowOptions
) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!placeId) {
      setLoading(false);
      return;
    }

    const checkFollow = async () => {
      try {
        const [following, count] = await Promise.all([
          isFollowingPlace(placeId),
          getPlaceFollowersCount(placeId),
        ]);
        setIsFollowing(following);
        setFollowersCount(count);
      } catch (error) {
        console.error('Erro ao verificar follow:', error);
        setIsFollowing(false);
        setFollowersCount(0);
      } finally {
        setLoading(false);
      }
    };

    checkFollow();
  }, [placeId]);

  const toggleFollow = async () => {
    if (!placeId) return;

    try {
      if (isFollowing) {
        await unfollowPlace(placeId);
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
        await followPlace(placeId);
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
      
      // Callback para atualizar UI se necessário
      options?.onFollowChange?.();
    } catch (error) {
      console.error('Erro ao alternar follow:', error);
      throw error;
    }
  };

  const refreshCount = async () => {
    if (!placeId) return;
    try {
      const count = await getPlaceFollowersCount(placeId);
      setFollowersCount(count);
    } catch (error) {
      console.error('Erro ao atualizar contador:', error);
    }
  };

  return {
    isFollowing,
    followersCount,
    toggleFollow,
    refreshCount,
    loading,
  };
};
