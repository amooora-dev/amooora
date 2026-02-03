import { Review } from '../types';
import { supabase } from '../infra/supabase';

export const getReviews = async (): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar avaliações:', error);
      throw new Error(`Erro ao buscar avaliações: ${error.message}`);
    }

    return (data || []).map((review) => ({
      id: review.id,
      placeId: review.place_id || undefined,
      serviceId: review.service_id || undefined,
      eventId: review.event_id || undefined,
      userId: review.user_id,
      userName: review.profiles?.name || review.author_name || 'Usuário',
      userAvatar: review.profiles?.avatar || undefined,
      author: review.profiles?.name || review.author_name || 'Usuário',
      avatar: review.profiles?.avatar || undefined,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.created_at,
      date: review.created_at ? new Date(review.created_at).toLocaleDateString('pt-BR') : undefined,
    }));
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    throw error;
  }
};

export const getReviewsByPlaceId = async (placeId: string): Promise<Review[]> => {
  try {
    if (!placeId) {
      console.warn('[getReviewsByPlaceId] placeId é undefined ou vazio');
      return [];
    }

    console.log('[getReviewsByPlaceId] Buscando reviews para placeId:', placeId);
    
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar
        )
      `)
      .eq('place_id', placeId)
      .is('event_id', null)
      .is('service_id', null)
      .order('created_at', { ascending: false });
    
    console.log('[getReviewsByPlaceId] Resultado:', { count: data?.length || 0, placeId, error: error?.message });

    if (error) {
      console.error('Erro ao buscar avaliações do local:', error);
      throw new Error(`Erro ao buscar avaliações do local: ${error.message}`);
    }

    return (data || []).map((review) => ({
      id: review.id,
      placeId: review.place_id || undefined,
      userId: review.user_id,
      userName: review.profiles?.name || review.author_name || 'Usuário',
      userAvatar: review.profiles?.avatar || undefined,
      author: review.profiles?.name || review.author_name || 'Usuário',
      avatar: review.profiles?.avatar || undefined,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.created_at,
      date: review.created_at ? new Date(review.created_at).toLocaleDateString('pt-BR') : undefined,
    }));
  } catch (error) {
    console.error('Erro ao buscar avaliações do local:', error);
    throw error;
  }
};

export const getReviewsByServiceId = async (serviceId: string): Promise<Review[]> => {
  try {
    if (!serviceId) {
      console.warn('[getReviewsByServiceId] serviceId é undefined ou vazio');
      return [];
    }

    console.log('[getReviewsByServiceId] Buscando reviews para serviceId:', serviceId);
    
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar
        )
      `)
      .eq('service_id', serviceId)
      .is('place_id', null)
      .is('event_id', null)
      .order('created_at', { ascending: false });
    
    console.log('[getReviewsByServiceId] Resultado:', { count: data?.length || 0, serviceId, error: error?.message });

    if (error) {
      console.error('Erro ao buscar avaliações do serviço:', error);
      throw new Error(`Erro ao buscar avaliações do serviço: ${error.message}`);
    }

    return (data || []).map((review) => ({
      id: review.id,
      serviceId: review.service_id || undefined,
      userId: review.user_id,
      userName: review.profiles?.name || review.author_name || 'Usuário',
      userAvatar: review.profiles?.avatar || undefined,
      author: review.profiles?.name || review.author_name || 'Usuário',
      avatar: review.profiles?.avatar || undefined,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.created_at,
      date: review.created_at ? new Date(review.created_at).toLocaleDateString('pt-BR') : undefined,
    }));
  } catch (error) {
    console.error('Erro ao buscar avaliações do serviço:', error);
    throw error;
  }
};

export const getReviewsByEventId = async (eventId: string): Promise<Review[]> => {
  try {
    if (!eventId) {
      console.warn('[getReviewsByEventId] eventId é undefined ou vazio');
      return [];
    }

    console.log('[getReviewsByEventId] Buscando reviews para eventId:', eventId);
    
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar
        )
      `)
      .eq('event_id', eventId)
      .is('place_id', null)
      .is('service_id', null)
      .order('created_at', { ascending: false });
    
    console.log('[getReviewsByEventId] Resultado:', { count: data?.length || 0, eventId, error: error?.message });

    if (error) {
      console.error('Erro ao buscar avaliações do evento:', error);
      throw new Error(`Erro ao buscar avaliações do evento: ${error.message}`);
    }

    return (data || []).map((review) => ({
      id: review.id,
      eventId: review.event_id || undefined,
      userId: review.user_id,
      userName: review.profiles?.name || review.author_name || 'Usuário',
      userAvatar: review.profiles?.avatar || undefined,
      author: review.profiles?.name || review.author_name || 'Usuário',
      avatar: review.profiles?.avatar || undefined,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.created_at,
      date: review.created_at ? new Date(review.created_at).toLocaleDateString('pt-BR') : undefined,
    }));
  } catch (error) {
    console.error('Erro ao buscar avaliações do evento:', error);
    throw error;
  }
};

/**
 * Cria uma nova avaliação (funciona sem login usando nome opcional)
 */
export interface CreateReviewData {
  placeId?: string;
  serviceId?: string;
  eventId?: string;
  rating: number;
  comment: string;
  authorName?: string; // Nome opcional para reviews sem login
}

export const createReview = async (data: CreateReviewData): Promise<Review> => {
  try {
    console.log('[createReview] Criando review:', { 
      placeId: data.placeId, 
      serviceId: data.serviceId, 
      eventId: data.eventId,
      hasRating: !!data.rating,
      hasComment: !!data.comment
    });

    // Buscar usuário atual (pode ser null se não estiver logado)
    const { data: { user } } = await supabase.auth.getUser();
    
    const reviewData: any = {
      rating: data.rating,
      comment: data.comment.trim(),
    };

    // Adicionar IDs específicos - garantir que apenas um tipo seja salvo
    if (data.placeId) {
      reviewData.place_id = data.placeId;
      reviewData.service_id = null;
      reviewData.event_id = null;
      console.log('[createReview] Salvando review para LOCAL:', data.placeId);
    } else if (data.serviceId) {
      reviewData.service_id = data.serviceId;
      reviewData.place_id = null;
      reviewData.event_id = null;
      console.log('[createReview] Salvando review para SERVIÇO:', data.serviceId);
    } else if (data.eventId) {
      reviewData.event_id = data.eventId;
      reviewData.place_id = null;
      reviewData.service_id = null;
      console.log('[createReview] Salvando review para EVENTO:', data.eventId);
    } else {
      console.error('[createReview] ERRO: Nenhum ID fornecido (placeId, serviceId ou eventId)');
      throw new Error('É necessário fornecer placeId, serviceId ou eventId');
    }

    // Se não estiver logado, usar nome opcional (precisa estar na tabela reviews)
    if (!user && data.authorName) {
      reviewData.user_id = null; // ou um UUID específico para anônimos
      reviewData.author_name = data.authorName.trim();
    } else if (user) {
      reviewData.user_id = user.id;
    } else {
      // Se não tem usuário nem nome, usar "Visitante"
      reviewData.author_name = 'Visitante';
    }

    const { data: newReview, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar
        )
      `)
      .single();

    if (error) {
      console.error('Erro ao criar avaliação:', error);
      throw new Error(`Erro ao criar avaliação: ${error.message}`);
    }

    return {
      id: newReview.id,
      placeId: newReview.place_id || undefined,
      serviceId: newReview.service_id || undefined,
      eventId: newReview.event_id || undefined,
      userId: newReview.user_id || '',
      userName: newReview.profiles?.name || newReview.author_name || 'Usuário',
      userAvatar: newReview.profiles?.avatar || undefined,
      author: newReview.profiles?.name || newReview.author_name || 'Usuário',
      avatar: newReview.profiles?.avatar || undefined,
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: newReview.created_at,
      date: newReview.created_at ? new Date(newReview.created_at).toLocaleDateString('pt-BR') : undefined,
    };
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    throw error;
  }
};

/**
 * Calcula a média de avaliações para um item
 */
export const calculateAverageRating = (reviews: Review[]): number => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10; // Arredondar para 1 casa decimal
};
