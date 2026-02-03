import { useState, useEffect } from 'react';
import { followCommunity, unfollowCommunity, isFollowingCommunity, getCommunityFollowersCount } from '../services/communityFollows';
import { useAuth } from '../../../shared/hooks';

interface UseCommunityFollowOptions {
  onFollowChange?: () => void;
}

export const useCommunityFollow = (
  communityId: string | undefined,
  options?: UseCommunityFollowOptions
) => {
  const { isAuthenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!communityId) {
      setLoading(false);
      return;
    }

    // Só verificar follow se estiver autenticado
    if (!isAuthenticated) {
      setIsFollowing(false);
      // Ainda buscar contador de seguidores (não requer autenticação)
      getCommunityFollowersCount(communityId)
        .then(count => {
          setFollowersCount(count);
          setLoading(false);
        })
        .catch(error => {
          console.error('Erro ao buscar contador de seguidores:', error);
          setFollowersCount(0);
          setLoading(false);
        });
      return;
    }

    const checkFollow = async () => {
      try {
        const [following, count] = await Promise.all([
          isFollowingCommunity(communityId),
          getCommunityFollowersCount(communityId),
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
  }, [communityId, isAuthenticated]);

  const toggleFollow = async () => {
    if (!communityId) return;

    try {
      if (isFollowing) {
        await unfollowCommunity(communityId);
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
        await followCommunity(communityId);
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
    if (!communityId) return;
    try {
      const count = await getCommunityFollowersCount(communityId);
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
