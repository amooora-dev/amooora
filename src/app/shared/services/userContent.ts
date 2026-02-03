import { supabase } from '../../infra/supabase';
import type { Event } from '../types';
import type { Place } from '../../features/places/types';
import type { Community } from '../../features/communities/services/communities';

export interface UserContent {
  events: Event[];
  places: Place[];
  communities: Community[];
}

/**
 * Buscar todos os conteúdos criados pelo usuário logado
 */
export async function getUserContent(): Promise<UserContent> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { events: [], places: [], communities: [] };
    }

    const [eventsResult, placesResult, communitiesResult] = await Promise.all([
      getUserEvents(user.id),
      getUserPlaces(user.id),
      getUserCommunities(user.id),
    ]);

    return {
      events: eventsResult,
      places: placesResult,
      communities: communitiesResult,
    };
  } catch (error) {
    console.error('❌ Erro ao buscar conteúdos do usuário:', error);
    throw error;
  }
}

/**
 * Buscar eventos criados pelo usuário
 */
export async function getUserEvents(userId: string): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro ao buscar eventos do usuário:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((event) => ({
      id: event.id,
      name: event.name,
      description: event.description,
      image: event.image || undefined,
      imageUrl: event.image || undefined,
      date: event.date,
      time: event.date ? new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : undefined,
      endTime: event.end_time || undefined,
      location: event.location,
      category: event.category,
      price: event.price ? Number(event.price) : undefined,
      participants: event.participants_count || 0,
      isActive: event.is_active ?? true,
    }));
  } catch (error) {
    console.error('❌ Erro ao buscar eventos do usuário:', error);
    return [];
  }
}

/**
 * Buscar locais criados pelo usuário
 */
export async function getUserPlaces(userId: string): Promise<Place[]> {
  try {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro ao buscar locais do usuário:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((place) => ({
      id: place.id,
      name: place.name,
      description: place.description || undefined,
      image: place.image,
      imageUrl: place.image,
      address: place.address || undefined,
      rating: Number(place.rating) || 0,
      category: place.category,
      latitude: place.latitude ? Number(place.latitude) : undefined,
      longitude: place.longitude ? Number(place.longitude) : undefined,
      reviewCount: place.review_count || 0,
      isSafe: place.is_safe ?? true,
      distance: undefined,
    }));
  } catch (error) {
    console.error('❌ Erro ao buscar locais do usuário:', error);
    return [];
  }
}

/**
 * Buscar comunidades criadas pelo usuário
 */
export async function getUserCommunities(userId: string): Promise<Community[]> {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro ao buscar comunidades do usuário:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((community: any) => ({
      id: community.id,
      name: community.name,
      description: community.description || '',
      image: community.image || undefined,
      imageUrl: community.image || undefined,
      icon: community.icon || undefined,
      category: community.category || undefined,
      membersCount: community.members_count || 0,
      postsCount: community.posts_count || 0,
      isActive: community.is_active ?? true,
      createdAt: community.created_at,
    }));
  } catch (error) {
    console.error('❌ Erro ao buscar comunidades do usuário:', error);
    return [];
  }
}

/**
 * Desativar conteúdo (evento, local ou comunidade)
 */
export async function deactivateContent(
  type: 'event' | 'place' | 'community',
  id: string
): Promise<void> {
  try {
    const tableName = type === 'event' ? 'events' : type === 'place' ? 'places' : 'communities';
    const activeField = type === 'place' ? 'is_safe' : 'is_active';

    const { error } = await supabase
      .from(tableName)
      .update({ [activeField]: false })
      .eq('id', id);

    if (error) {
      console.error(`❌ Erro ao desativar ${type}:`, error);
      throw new Error(`Erro ao desativar ${type}: ${error.message}`);
    }
  } catch (error) {
    console.error(`❌ Erro ao desativar ${type}:`, error);
    throw error;
  }
}

/**
 * Ativar conteúdo (evento, local ou comunidade)
 */
export async function activateContent(
  type: 'event' | 'place' | 'community',
  id: string
): Promise<void> {
  try {
    const tableName = type === 'event' ? 'events' : type === 'place' ? 'places' : 'communities';
    const activeField = type === 'place' ? 'is_safe' : 'is_active';

    const { error } = await supabase
      .from(tableName)
      .update({ [activeField]: true })
      .eq('id', id);

    if (error) {
      console.error(`❌ Erro ao ativar ${type}:`, error);
      throw new Error(`Erro ao ativar ${type}: ${error.message}`);
    }
  } catch (error) {
    console.error(`❌ Erro ao ativar ${type}:`, error);
    throw error;
  }
}
