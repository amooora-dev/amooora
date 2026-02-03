import { useMemo } from 'react';
import { usePlaceReviews } from './useReviews';
import { calculateAverageRating } from '../../shared/services';

/**
 * Hook para calcular rating médio real baseado nas reviews de um lugar
 */
export const usePlaceRating = (placeId: string | undefined) => {
  const { reviews } = usePlaceReviews(placeId);
  
  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return null;
    return calculateAverageRating(reviews);
  }, [reviews]);

  return averageRating;
};

/**
 * Hook para calcular ratings médios de múltiplos lugares
 */
export const usePlacesRatings = (placeIds: string[]) => {
  // Por enquanto, retornar um objeto vazio
  // Em uma implementação futura, poderíamos buscar todas as reviews de uma vez
  // e calcular os ratings médios
  return useMemo(() => {
    const ratings: Record<string, number> = {};
    // Implementação futura: buscar reviews de todos os lugares e calcular médias
    return ratings;
  }, [placeIds]);
};
