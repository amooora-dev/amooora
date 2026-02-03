import { supabase } from '../../../infra/supabase';

export interface EventParticipant {
  id: string;
  user_id: string;
  event_id: string;
  created_at: string;
  profile: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
}

/**
 * Busca todos os participantes de um evento com seus perfis
 */
export async function getEventParticipants(eventId: string): Promise<EventParticipant[]> {
  try {
    const { data, error } = await supabase
      .from('event_participants')
      .select(`
        id,
        user_id,
        event_id,
        created_at,
        profiles:user_id (
          id,
          name,
          email,
          avatar,
          bio
        )
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar participantes do evento:', error);
      throw new Error(`Erro ao buscar participantes: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item: any) => ({
      id: item.id,
      user_id: item.user_id,
      event_id: item.event_id,
      created_at: item.created_at,
      profile: {
        id: item.profiles?.id || item.user_id,
        name: item.profiles?.name || 'Usuário',
        email: item.profiles?.email || '',
        avatar: item.profiles?.avatar || undefined,
        bio: item.profiles?.bio || undefined,
      },
    }));
  } catch (error) {
    console.error('Erro ao buscar participantes do evento:', error);
    return [];
  }
}

/**
 * Conta o número de participantes de um evento
 */
export async function getEventParticipantsCount(eventId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('event_participants')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    if (error) {
      console.error('Erro ao contar participantes do evento:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Erro ao contar participantes do evento:', error);
    return 0;
  }
}
