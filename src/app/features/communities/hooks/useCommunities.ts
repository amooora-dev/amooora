import { useState, useEffect } from 'react';
import { getCommunities, getCommunityById, Community } from '../services/communities';

export const useCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadCommunities = async () => {
    try {
      setLoading(true);
      const data = await getCommunities();
      setCommunities(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar comunidades:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommunities();
  }, []);

  return {
    communities,
    loading,
    error,
    refetch: loadCommunities,
  };
};

export const useCommunity = (communityId: string | undefined) => {
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!communityId) {
      setLoading(false);
      return;
    }

    const loadCommunity = async () => {
      try {
        setLoading(true);
        const data = await getCommunityById(communityId);
        setCommunity(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar comunidade:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    };

    loadCommunity();
  }, [communityId]);

  return { community, loading, error, refetch: () => communityId && getCommunityById(communityId).then(setCommunity) };
};
