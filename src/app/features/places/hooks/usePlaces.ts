import { useState, useEffect } from 'react';
import { Place } from '../types';
import { getPlaces, getPlaceById } from '../services/places';

interface UsePlacesOptions {
  limit?: number;
  enablePagination?: boolean;
}

export const usePlaces = (options: UsePlacesOptions = {}) => {
  const { limit = 20, enablePagination = false } = options;
  const [places, setPlaces] = useState<Place[]>([]);
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
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () =>
            reject(
              new Error(
                'Timeout ao carregar locais. Verifique sua conexão ou as políticas RLS do Supabase.'
              )
            ),
          30000
        );
      });

      const result = await Promise.race([
        enablePagination ? getPlaces(limit, currentOffset) : getPlaces(),
        timeoutPromise,
      ]);

      if (enablePagination && 'hasMore' in result) {
        if (reset) {
          setPlaces(result.data || []);
        } else {
          setPlaces((prev) => [...prev, ...(result.data || [])]);
        }
        setHasMore(result.hasMore);
        setOffset(currentOffset + (result.data?.length || 0));
      } else if (!enablePagination) {
        const placesData = Array.isArray(result) ? result : result.data || [];
        setPlaces(placesData);
        setHasMore(false);
      }
      
      setError(null);
    } catch (err) {
      console.error('❌ Erro no hook usePlaces:', err);
      setError(err instanceof Error ? err : new Error('Erro ao carregar locais'));
      if (reset) {
        setPlaces([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = () => {
    if (!loading && hasMore && enablePagination) {
      loadData(false);
    }
  };

  return { 
    places, 
    loading, 
    error, 
    hasMore: enablePagination ? hasMore : false, 
    loadMore: enablePagination ? loadMore : undefined,
    refetch: () => loadData(true),
  };
};

export const usePlace = (id: string | undefined) => {
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setPlace(null);
      setLoading(false);
      return;
    }

    const loadPlace = async () => {
      try {
        setLoading(true);
        const data = await getPlaceById(id);
        setPlace(data);
        if (!data) {
          setError(new Error('Local não encontrado'));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar local'));
      } finally {
        setLoading(false);
      }
    };

    loadPlace();
  }, [id]);

  return { place, loading, error };
};

