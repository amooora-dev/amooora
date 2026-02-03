import { useState, useEffect } from 'react';
import { markPlaceAsVisited, removePlaceVisit, hasPlaceVisit } from '../services/placeInteractions';

interface UsePlaceInteractionsOptions {
  onVisitChange?: () => void;
}

export const usePlaceInteractions = (
  placeId: string | undefined,
  options?: UsePlaceInteractionsOptions
) => {
  const [isVisited, setIsVisited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!placeId) {
      setLoading(false);
      return;
    }

    const checkVisit = async () => {
      try {
        const visited = await hasPlaceVisit(placeId);
        setIsVisited(visited);
      } catch (error) {
        console.error('Erro ao verificar visita:', error);
        setIsVisited(false);
      } finally {
        setLoading(false);
      }
    };

    checkVisit();
  }, [placeId]);

  const toggleVisit = async () => {
    if (!placeId) return;

    try {
      if (isVisited) {
        await removePlaceVisit(placeId);
        setIsVisited(false);
      } else {
        await markPlaceAsVisited(placeId);
        setIsVisited(true);
      }
      
      // Callback para atualizar UI se necessário
      options?.onVisitChange?.();
    } catch (error) {
      console.error('Erro ao alternar visita:', error);
      throw error;
    }
  };

  return {
    isVisited,
    toggleVisit,
    loading,
  };
};
