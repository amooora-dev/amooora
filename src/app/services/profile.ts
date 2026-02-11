import { supabase } from '../infra/supabase';

export interface ProfileStats {
  eventsCount: number;
  placesCount: number;
  friendsCount: number;
}

export interface SavedPlace {
  id: string;
  place_id: string;
  name: string;
  category: string;
  rating: number;
  imageUrl: string;
}

export interface VisitedPlace {
  id: string;
  place_id: string;
  name: string;
  category: string;
  rating: number;
  imageUrl: string;
  visited_at: string;
}

export interface UpcomingEvent {
  id: string;
  event_id: string;
  name: string;
  date: string;
  time: string;
  location: string;
}

export interface AttendedEvent {
  id: string;
  event_id: string;
  name: string;
  date: string;
  location: string;
}

export interface UserReview {
  id: string;
  place_id?: string;
  service_id?: string;
  event_id?: string;
  placeName?: string;
  serviceName?: string;
  eventName?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FollowedCommunity {
  id: string;
  community_id: string;
  name: string;
  description: string;
  category?: string;
  imageUrl: string;
  membersCount: number;
  postsCount: number;
}

/**
 * Busca estatísticas do perfil do usuário logado
 */
export const getProfileStats = async (userId: string): Promise<ProfileStats> => {
  try {
    // Contar eventos que o usuário vai participar (futuros)
    const { data: upcomingEventsData } = await supabase
      .from('event_participants')
      .select('event_id, events!inner(date)')
      .eq('user_id', userId)
      .gte('events.date', new Date().toISOString());

    // Contar eventos que o usuário participou (passados)
    const { data: attendedEventsData } = await supabase
      .from('event_participants')
      .select('event_id, events!inner(date)')
      .eq('user_id', userId)
      .lt('events.date', new Date().toISOString());

    // Contar lugares favoritos
    const { data: savedPlacesData } = await supabase
      .from('saved_places')
      .select('id')
      .eq('user_id', userId);

    // Contar amigos (conexões aceitas) - módulo friends
    let friendsCount = 0;
    try {
      const { count: friendsCountData } = await supabase
        .from('friend_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'accepted')
        .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);
      friendsCount = friendsCountData ?? 0;
    } catch {
      // Tabela pode não existir ainda; manter 0
    }

    return {
      eventsCount: (upcomingEventsData?.length || 0) + (attendedEventsData?.length || 0),
      placesCount: savedPlacesData?.length || 0,
      friendsCount,
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas do perfil:', error);
    return {
      eventsCount: 0,
      placesCount: 0,
      friendsCount: 0,
    };
  }
};

/**
 * Busca locais favoritos do usuário (do localStorage)
 */
export const getSavedPlaces = async (userId: string): Promise<SavedPlace[]> => {
  try {
    // Buscar favoritos do localStorage
    const favoritesKey = 'amooora_favorites';
    const stored = localStorage.getItem(favoritesKey);
    if (!stored) return [];

    const favorites = JSON.parse(stored);
    const placeIds = favorites.places || [];

    if (placeIds.length === 0) return [];

    // Buscar dados dos lugares favoritos
    const { data, error } = await supabase
      .from('places')
      .select('id, name, category, rating, image')
      .in('id', placeIds)
      .eq('is_active', true)
      .limit(10);

    if (error) {
      console.error('Erro ao buscar locais favoritos:', error);
      return [];
    }

    return (data || []).map((place: any) => ({
      id: place.id,
      place_id: place.id,
      name: place.name || 'Local desconhecido',
      category: place.category || 'Outros',
      rating: Number(place.rating) || 0,
      imageUrl: place.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem',
    }));
  } catch (error) {
    console.error('Erro ao buscar locais favoritos:', error);
    return [];
  }
};

/**
 * Busca eventos favoritos do usuário (do localStorage)
 */
export const getFavoriteEvents = async (userId: string): Promise<UpcomingEvent[]> => {
  try {
    // Buscar favoritos do localStorage
    const favoritesKey = 'amooora_favorites';
    const stored = localStorage.getItem(favoritesKey);
    if (!stored) return [];

    const favorites = JSON.parse(stored);
    const eventIds = favorites.events || [];

    if (eventIds.length === 0) return [];

    // Buscar dados dos eventos favoritos
    const { data, error } = await supabase
      .from('events')
      .select('id, name, date, location')
      .in('id', eventIds)
      .eq('is_active', true)
      .limit(10);

    if (error) {
      console.error('Erro ao buscar eventos favoritos:', error);
      return [];
    }

    return (data || []).map((event: any) => {
      let formattedDate = 'Data não informada';
      let time = '';
      
      if (event.date) {
        const date = new Date(event.date);
        const day = date.getDate();
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const month = months[date.getMonth()];
        formattedDate = `${day.toString().padStart(2, '0')} ${month}`;
        time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      }
      
      return {
        id: event.id,
        event_id: event.id,
        name: event.name || 'Evento desconhecido',
        date: formattedDate,
        time,
        location: event.location || 'Local não informado',
      };
    });
  } catch (error) {
    console.error('Erro ao buscar eventos favoritos:', error);
    return [];
  }
};

/**
 * Busca serviços favoritos do usuário (do localStorage)
 */
export const getFavoriteServices = async (userId: string): Promise<Array<{
  id: string;
  service_id: string;
  name: string;
  category: string;
  provider: string;
  imageUrl: string;
}>> => {
  try {
    // Buscar favoritos do localStorage
    const favoritesKey = 'amooora_favorites';
    const stored = localStorage.getItem(favoritesKey);
    if (!stored) return [];

    const favorites = JSON.parse(stored);
    const serviceIds = favorites.services || [];

    if (serviceIds.length === 0) return [];

    // Buscar dados dos serviços favoritos
    const { data, error } = await supabase
      .from('services')
      .select('id, name, category, provider, image')
      .in('id', serviceIds)
      .eq('is_active', true)
      .limit(10);

    if (error) {
      console.error('Erro ao buscar serviços favoritos:', error);
      return [];
    }

    return (data || []).map((service: any) => ({
      id: service.id,
      service_id: service.id,
      name: service.name || 'Serviço desconhecido',
      category: service.category || 'Outros',
      provider: service.provider || 'Fornecedor não informado',
      imageUrl: service.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem',
    }));
  } catch (error) {
    console.error('Erro ao buscar serviços favoritos:', error);
    return [];
  }
};

/**
 * Busca locais frequentados pelo usuário
 */
export const getVisitedPlaces = async (userId: string): Promise<VisitedPlace[]> => {
  try {
    const { data, error } = await supabase
      .from('visited_places')
      .select(`
        id,
        place_id,
        created_at,
        places:place_id (
          name,
          category,
          rating,
          image
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Erro ao buscar locais frequentados:', error);
      return [];
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      place_id: item.place_id,
      name: item.places?.name || 'Local desconhecido',
      category: item.places?.category || 'Outros',
      rating: Number(item.places?.rating) || 0,
      imageUrl: item.places?.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem',
      visited_at: item.created_at,
    }));
  } catch (error) {
    console.error('Erro ao buscar locais frequentados:', error);
    return [];
  }
};

/**
 * Busca eventos que o usuário tem interesse
 */
export const getInterestedEvents = async (userId: string): Promise<UpcomingEvent[]> => {
  try {
    console.log('🔍 [getInterestedEvents] Buscando eventos de interesse para userId:', userId);
    
    // Verificar sessão atual
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    console.log('🔍 [getInterestedEvents] Usuário autenticado:', currentUser?.id);
    console.log('🔍 [getInterestedEvents] userId recebido:', userId);
    console.log('🔍 [getInterestedEvents] IDs coincidem?', currentUser?.id === userId);
    
    // Primeiro, buscar os interesses sem join para verificar se existem
    const { data: interestsData, error: interestsError } = await supabase
      .from('event_interests')
      .select('id, event_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (interestsError) {
      console.error('❌ [getInterestedEvents] Erro ao buscar interesses:', interestsError);
      return [];
    }

    if (!interestsData || interestsData.length === 0) {
      console.log('⚠️ [getInterestedEvents] Nenhum interesse encontrado para o usuário:', userId);
      return [];
    }

    console.log('✅ [getInterestedEvents] Interesses encontrados:', interestsData.length);

    // Agora buscar os eventos relacionados
    const eventIds = interestsData.map(item => item.event_id);
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('id, name, date, location')
      .in('id', eventIds)
      .eq('is_active', true); // Apenas eventos ativos

    if (eventsError) {
      console.error('❌ [getInterestedEvents] Erro ao buscar eventos:', eventsError);
      return [];
    }

    // Combinar os dados
    const data = interestsData.map(interest => {
      const event = eventsData?.find(e => e.id === interest.event_id);
      return {
        ...interest,
        events: event || null,
      };
    }).filter(item => item.events !== null); // Remover interesses sem evento válido

    console.log('✅ [getInterestedEvents] Dados combinados:', data?.length || 0, 'registros');
    if (data && data.length > 0) {
      console.log('✅ [getInterestedEvents] Primeiro registro:', data[0]);
    }

    if (!data || data.length === 0) {
      console.log('⚠️ [getInterestedEvents] Nenhum evento de interesse válido encontrado para o usuário:', userId);
      return [];
    }

    return data.map((item: any) => {
      const event = item.events;
      if (!event) {
        console.warn('Evento não encontrado para event_id:', item.event_id);
        return null;
      }

      const eventDate = event.date ? new Date(event.date) : new Date();
      const day = eventDate.getDate().toString().padStart(2, '0');
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const month = months[eventDate.getMonth()];
      const time = event.date ? new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';

      return {
        id: item.id,
        event_id: item.event_id,
        name: event.name || 'Evento desconhecido',
        date: `${day} ${month}`,
        time,
        location: event.location || 'Local não informado',
      };
    }).filter((event): event is UpcomingEvent => event !== null);
  } catch (error) {
    console.error('Erro ao buscar eventos de interesse:', error);
    return [];
  }
};

/**
 * Busca eventos futuros que o usuário vai participar
 */
export const getUpcomingEvents = async (userId: string): Promise<UpcomingEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('event_participants')
      .select(`
        id,
        event_id,
        events:event_id (
          name,
          date,
          location
        )
      `)
      .eq('user_id', userId)
      .gte('events.date', new Date().toISOString())
      .order('events.date', { ascending: true })
      .limit(5);

    if (error) {
      console.error('Erro ao buscar eventos futuros:', error);
      return [];
    }

    return (data || []).map((item: any) => {
      const eventDate = new Date(item.events?.date);
      const day = eventDate.getDate().toString().padStart(2, '0');
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const month = months[eventDate.getMonth()];
      const time = eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      return {
        id: item.id,
        event_id: item.event_id,
        name: item.events?.name || 'Evento desconhecido',
        date: `${day} ${month}`,
        time,
        location: item.events?.location || 'Local não informado',
      };
    });
  } catch (error) {
    console.error('Erro ao buscar eventos futuros:', error);
    return [];
  }
};

/**
 * Busca eventos que o usuário participou (marcou como "Fui!!")
 * Busca todos os eventos, não apenas passados
 */
export const getAttendedEvents = async (userId: string): Promise<AttendedEvent[]> => {
  try {
    console.log('🔍 [getAttendedEvents] Buscando eventos participados para userId:', userId);
    
    // Verificar sessão atual
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    console.log('🔍 [getAttendedEvents] Usuário autenticado:', currentUser?.id);
    console.log('🔍 [getAttendedEvents] userId recebido:', userId);
    console.log('🔍 [getAttendedEvents] IDs coincidem?', currentUser?.id === userId);
    
    // Primeiro, buscar as participações sem join para verificar se existem
    const { data: participantsData, error: participantsError } = await supabase
      .from('event_participants')
      .select('id, event_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (participantsError) {
      console.error('❌ [getAttendedEvents] Erro ao buscar participações:', participantsError);
      return [];
    }

    if (!participantsData || participantsData.length === 0) {
      console.log('⚠️ [getAttendedEvents] Nenhuma participação encontrada para o usuário:', userId);
      return [];
    }

    console.log('✅ [getAttendedEvents] Participações encontradas:', participantsData.length);

    // Agora buscar os eventos relacionados
    const eventIds = participantsData.map(item => item.event_id);
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('id, name, date, location')
      .in('id', eventIds)
      .eq('is_active', true); // Apenas eventos ativos

    if (eventsError) {
      console.error('❌ [getAttendedEvents] Erro ao buscar eventos:', eventsError);
      return [];
    }

    // Combinar os dados
    const data = participantsData.map(participant => {
      const event = eventsData?.find(e => e.id === participant.event_id);
      return {
        ...participant,
        events: event || null,
      };
    }).filter(item => item.events !== null); // Remover participações sem evento válido

    console.log('✅ [getAttendedEvents] Dados combinados:', data?.length || 0, 'registros');
    if (data && data.length > 0) {
      console.log('✅ [getAttendedEvents] Primeiro registro:', data[0]);
    }

    if (!data || data.length === 0) {
      console.log('⚠️ [getAttendedEvents] Nenhum evento participado válido encontrado para o usuário:', userId);
      return [];
    }

    return data.map((item: any) => {
      const event = item.events;
      if (!event) {
        console.warn('Evento não encontrado para event_id:', item.event_id);
        return null;
      }

      const eventDate = event.date ? new Date(event.date) : new Date();
      const day = eventDate.getDate().toString().padStart(2, '0');
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const month = months[eventDate.getMonth()];

      return {
        id: item.id,
        event_id: item.event_id,
        name: event.name || 'Evento desconhecido',
        date: `${day} ${month}`,
        location: event.location || 'Local não informado',
      };
    }).filter((event): event is AttendedEvent => event !== null);
  } catch (error) {
    console.error('Erro ao buscar eventos participados:', error);
    return [];
  }
};

/**
 * Busca reviews do usuário
 */
export const getUserReviews = async (userId: string): Promise<UserReview[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        place_id,
        service_id,
        event_id,
        rating,
        comment,
        created_at,
        places:place_id (name),
        services:service_id (name),
        events:event_id (name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar reviews do usuário:', error);
      return [];
    }

    return (data || []).map((review: any) => {
      const reviewDate = new Date(review.created_at);
      const day = reviewDate.getDate().toString().padStart(2, '0');
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const month = months[reviewDate.getMonth()];

      return {
        id: review.id,
        place_id: review.place_id || undefined,
        service_id: review.service_id || undefined,
        event_id: review.event_id || undefined,
        placeName: review.places?.name || undefined,
        serviceName: review.services?.name || undefined,
        eventName: review.events?.name || undefined,
        rating: review.rating,
        comment: review.comment,
        date: `${day} ${month}`,
      };
    });
  } catch (error) {
    console.error('Erro ao buscar reviews do usuário:', error);
    return [];
  }
};

/**
 * Busca comunidades que o usuário segue
 */
export const getFollowedCommunities = async (userId: string): Promise<FollowedCommunity[]> => {
  try {
    const { data, error } = await supabase
      .from('community_members')
      .select(`
        id,
        community_id,
        communities:community_id (
          name,
          description,
          category,
          image,
          members_count,
          posts_count
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Erro ao buscar comunidades seguidas:', error);
      return [];
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      community_id: item.community_id,
      name: item.communities?.name || 'Comunidade desconhecida',
      description: item.communities?.description || '',
      category: item.communities?.category || undefined,
      imageUrl: item.communities?.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
      membersCount: item.communities?.members_count || 0,
      postsCount: item.communities?.posts_count || 0,
    }));
  } catch (error) {
    console.error('Erro ao buscar comunidades seguidas:', error);
    return [];
  }
};
