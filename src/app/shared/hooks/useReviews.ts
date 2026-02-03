import { useState, useEffect } from 'react';
import { Review } from '../types';
import { getReviewsByPlaceId, getReviewsByServiceId, getReviewsByEventId, getReviewsByCommunityId } from '../services';

export const usePlaceReviews = (placeId: string | undefined) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!placeId) {
      console.log('[usePlaceReviews] placeId não fornecido, limpando reviews');
      setReviews([]);
      setLoading(false);
      return;
    }

    console.log('[usePlaceReviews] Carregando reviews para placeId:', placeId);

    const loadReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getReviewsByPlaceId(placeId);
        
        if (!cancelled) {
          console.log('[usePlaceReviews] Reviews carregados:', { placeId, count: data?.length || 0 });
          setReviews(data || []);
        }
      } catch (err) {
        console.error('[usePlaceReviews] Erro ao carregar avaliações:', err);
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Erro ao carregar avaliações'));
          setReviews([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, [placeId]);

  return { 
    reviews, 
    loading, 
    error, 
    refetch: async () => {
      if (placeId) {
        console.log('[usePlaceReviews] Refetch solicitado para placeId:', placeId);
        try {
          setLoading(true);
          const data = await getReviewsByPlaceId(placeId);
          setReviews(data || []);
          setError(null);
        } catch (err) {
          console.error('[usePlaceReviews] Erro no refetch:', err);
          setError(err instanceof Error ? err : new Error('Erro ao refetch avaliações'));
        } finally {
          setLoading(false);
        }
      }
    }
  };
};

export const useServiceReviews = (serviceId: string | undefined) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!serviceId) {
      console.log('[useServiceReviews] serviceId não fornecido, limpando reviews');
      setReviews([]);
      setLoading(false);
      return;
    }

    console.log('[useServiceReviews] Carregando reviews para serviceId:', serviceId);

    const loadReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getReviewsByServiceId(serviceId);
        
        if (!cancelled) {
          console.log('[useServiceReviews] Reviews carregados:', { serviceId, count: data?.length || 0 });
          setReviews(data || []);
        }
      } catch (err) {
        console.error('[useServiceReviews] Erro ao carregar avaliações:', err);
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Erro ao carregar avaliações'));
          setReviews([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, [serviceId]);

  return { 
    reviews, 
    loading, 
    error, 
    refetch: async () => {
      if (serviceId) {
        console.log('[useServiceReviews] Refetch solicitado para serviceId:', serviceId);
        try {
          setLoading(true);
          const data = await getReviewsByServiceId(serviceId);
          setReviews(data || []);
          setError(null);
        } catch (err) {
          console.error('[useServiceReviews] Erro no refetch:', err);
          setError(err instanceof Error ? err : new Error('Erro ao refetch avaliações'));
        } finally {
          setLoading(false);
        }
      }
    }
  };
};

export const useEventReviews = (eventId: string | undefined) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!eventId) {
      console.log('[useEventReviews] eventId não fornecido, limpando reviews');
      setReviews([]);
      setLoading(false);
      return;
    }

    console.log('[useEventReviews] Carregando reviews para eventId:', eventId);

    const loadReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getReviewsByEventId(eventId);
        
        if (!cancelled) {
          console.log('[useEventReviews] Reviews carregados:', { eventId, count: data?.length || 0 });
          setReviews(data || []);
        }
      } catch (err) {
        console.error('[useEventReviews] Erro ao carregar avaliações:', err);
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Erro ao carregar avaliações'));
          setReviews([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  return { 
    reviews, 
    loading, 
    error, 
    refetch: async () => {
      if (eventId) {
        console.log('[useEventReviews] Refetch solicitado para eventId:', eventId);
        try {
          setLoading(true);
          const data = await getReviewsByEventId(eventId);
          setReviews(data || []);
          setError(null);
        } catch (err) {
          console.error('[useEventReviews] Erro no refetch:', err);
          setError(err instanceof Error ? err : new Error('Erro ao refetch avaliações'));
        } finally {
          setLoading(false);
        }
      }
    }
  };
};
export const useCommunityReviews = (communityId: string | undefined) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!communityId) {
      console.log('[useCommunityReviews] communityId não fornecido, limpando reviews');
      setReviews([]);
      setLoading(false);
      return;
    }

    console.log('[useCommunityReviews] Carregando reviews para communityId:', communityId);

    const loadReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getReviewsByCommunityId(communityId);
        
        if (!cancelled) {
          console.log('[useCommunityReviews] Reviews carregados:', { communityId, count: data?.length || 0 });
          setReviews(data || []);
        }
      } catch (err) {
        console.error('[useCommunityReviews] Erro ao carregar avaliações:', err);
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Erro ao carregar avaliações'));
          setReviews([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, [communityId]);

  return { 
    reviews, 
    loading, 
    error, 
    refetch: async () => {
      if (communityId) {
        console.log('[useCommunityReviews] Refetch solicitado para communityId:', communityId);
        try {
          setLoading(true);
          const data = await getReviewsByCommunityId(communityId);
          setReviews(data || []);
          setError(null);
        } catch (err) {
          console.error('[useCommunityReviews] Erro no refetch:', err);
          setError(err instanceof Error ? err : new Error('Erro ao refetch avaliações'));
        } finally {
          setLoading(false);
        }
      }
    }
  };
};
