import { supabase } from '../../infra/supabase';

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

    // Por enquanto, friendsCount é 0 (será implementado depois)
    const friendsCount = 0;

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
 * Busca locais favoritos do usuário
 */
export const getSavedPlaces = async (userId: string): Promise<SavedPlace[]> => {
  try {
    const { data, error } = await supabase
      .from('saved_places')
      .select(`
        id,
        place_id,
        places:place_id (
          name,
          category,
          rating,
          image
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Erro ao buscar locais favoritos:', error);
      return [];
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      place_id: item.place_id,
      name: item.places?.name || 'Local desconhecido',
      category: item.places?.category || 'Outros',
      rating: Number(item.places?.rating) || 0,
      imageUrl: item.places?.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem',
    }));
  } catch (error) {
    console.error('Erro ao buscar locais favoritos:', error);
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
 * Busca eventos passados que o usuário participou
 */
export const getAttendedEvents = async (userId: string): Promise<AttendedEvent[]> => {
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
      .lt('events.date', new Date().toISOString())
      .order('events.date', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Erro ao buscar eventos passados:', error);
      return [];
    }

    return (data || []).map((item: any) => {
      const eventDate = new Date(item.events?.date);
      const day = eventDate.getDate().toString().padStart(2, '0');
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const month = months[eventDate.getMonth()];

      return {
        id: item.id,
        event_id: item.event_id,
        name: item.events?.name || 'Evento desconhecido',
        date: `${day} ${month}`,
        location: item.events?.location || 'Local não informado',
      };
    });
  } catch (error) {
    console.error('Erro ao buscar eventos passados:', error);
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
