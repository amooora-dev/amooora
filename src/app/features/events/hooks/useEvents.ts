import { useState, useEffect } from 'react';
import { Event } from '../../shared/types';
import { getEvents, getEventById } from '../services/events';
import { filterUpcomingCatalogEvents } from '../utils/eventVisibility';

export type UseEventsOptions = {
  /** Quando true, omite eventos já encerrados (listagens públicas). Favoritos / perfil usam false. */
  filterPast?: boolean;
};

export const useEvents = (options?: UseEventsOptions) => {
  const filterPast = options?.filterPast ?? false;
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Timeout de segurança aumentado para 30 segundos
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Timeout ao carregar eventos. Verifique sua conexão ou as políticas RLS do Supabase.')), 30000);
        });
        
        const data = await Promise.race([getEvents(), timeoutPromise]);
        const list = data || [];
        setEvents(filterPast ? filterUpcomingCatalogEvents(list) : list);
      } catch (err) {
        console.error('❌ Erro no hook useEvents:', err);
        setError(err instanceof Error ? err : new Error('Erro ao carregar eventos'));
        setEvents([]); // Garantir que events seja array vazio em caso de erro
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [filterPast]);

  return { events, loading, error };
};

export const useEvent = (id: string | undefined) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setEvent(null);
      setLoading(false);
      return;
    }

    const loadEvent = async () => {
      try {
        setLoading(true);
        const data = await getEventById(id);
        setEvent(data);
        if (!data) {
          setError(new Error('Evento não encontrado'));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar evento'));
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  return { event, loading, error };
};
