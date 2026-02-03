import { Event } from '../../shared/types';
import { supabase } from '../../../infra/supabase';

export const getEvents = async (): Promise<Event[]> => {
  try {
    console.log('🔍 Buscando TODOS os eventos do Supabase...');
    
    // Buscar TODOS os eventos da tabela (sem filtros)
    // Apenas filtrar por is_active para evitar eventos desativados
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true) // Apenas eventos ativos
      .order('created_at', { ascending: false }); // Ordenar por data de criação (mais recente primeiro)

    if (error) {
      console.error('❌ Erro ao buscar eventos:', {
        message: error.message,
        code: error.code,
      });
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ Nenhum evento encontrado no banco');
      return [];
    }

    console.log(`✅ Total de eventos encontrados: ${data.length}`);

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
    }));
  } catch (error) {
    console.error('❌ Erro ao buscar eventos:', error);
    // Tentar buscar sem filtro de is_active como último recurso
    try {
      const { data: fallbackData } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false }); // Ordenar por data de criação (mais recente primeiro)
      
      if (fallbackData && fallbackData.length > 0) {
        console.warn('⚠️ Usando fallback: retornando todos os eventos (incluindo inativos)');
        return fallbackData.map((event) => ({
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
        }));
      }
    } catch (fallbackError) {
      console.error('❌ Erro no fallback:', fallbackError);
    }
    return [];
  }
};

export const createEvent = async (eventData: {
  name: string;
  description: string;
  image?: string;
  date: string; // ISO string
  location: string;
  category: string;
  price?: number;
  endTime?: string; // ISO string para horário de término
}): Promise<Event> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // Preparar end_time: se fornecido, combinar com a data do evento
    let endTimeValue: string | null = null;
    if (eventData.endTime) {
      // Se endTime é apenas hora (HH:MM), combinar com a data do evento
      const eventDate = new Date(eventData.date);
      const [hours, minutes] = eventData.endTime.split(':');
      eventDate.setHours(parseInt(hours || '0', 10), parseInt(minutes || '0', 10), 0, 0);
      endTimeValue = eventDate.toISOString();
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        name: eventData.name,
        description: eventData.description,
        image: eventData.image || null,
        date: eventData.date,
        end_time: endTimeValue,
        location: eventData.location,
        category: eventData.category,
        price: eventData.price || null,
        created_by: userId || null,
        is_active: true,
        participants_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar evento:', error);
      throw new Error(`Erro ao criar evento: ${error.message}`);
    }

    if (!data) {
      throw new Error('Erro ao criar evento: nenhum dado retornado');
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      image: data.image || undefined,
      imageUrl: data.image || undefined,
      date: data.date,
      time: data.date ? new Date(data.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : undefined,
      location: data.location,
      category: data.category,
      price: data.price ? Number(data.price) : undefined,
      participants: data.participants_count || 0,
    };
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    throw error;
  }
};

export const updateEvent = async (
  id: string,
  eventData: {
    name?: string;
    description?: string;
    image?: string;
    date?: string;
    location?: string;
    category?: string;
    price?: number;
    endTime?: string;
    isActive?: boolean;
  }
): Promise<Event> => {
  try {
    const updateData: any = {};
    
    if (eventData.name !== undefined) updateData.name = eventData.name;
    if (eventData.description !== undefined) updateData.description = eventData.description;
    if (eventData.image !== undefined) updateData.image = eventData.image || null;
    if (eventData.date !== undefined) updateData.date = eventData.date;
    if (eventData.location !== undefined) updateData.location = eventData.location;
    if (eventData.category !== undefined) updateData.category = eventData.category;
    if (eventData.price !== undefined) updateData.price = eventData.price || null;
    if (eventData.isActive !== undefined) updateData.is_active = eventData.isActive;

    // Preparar end_time se fornecido
    if (eventData.endTime !== undefined) {
      if (eventData.endTime) {
        const eventDate = eventData.date ? new Date(eventData.date) : new Date();
        const [hours, minutes] = eventData.endTime.split(':');
        eventDate.setHours(parseInt(hours || '0', 10), parseInt(minutes || '0', 10), 0, 0);
        updateData.end_time = eventDate.toISOString();
      } else {
        updateData.end_time = null;
      }
    }

    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar evento:', error);
      throw new Error(`Erro ao atualizar evento: ${error.message}`);
    }

    if (!data) {
      throw new Error('Erro ao atualizar evento: nenhum dado retornado');
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      image: data.image || undefined,
      imageUrl: data.image || undefined,
      date: data.date,
      time: data.date ? new Date(data.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : undefined,
      endTime: data.end_time || undefined,
      location: data.location,
      category: data.category,
      price: data.price ? Number(data.price) : undefined,
      participants: data.participants_count || 0,
    };
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    throw error;
  }
};

export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Erro ao buscar evento:', error);
      throw new Error(`Erro ao buscar evento: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      image: data.image || undefined,
      imageUrl: data.image || undefined,
      date: data.date,
      time: data.date ? new Date(data.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : undefined,
      endTime: data.end_time || undefined,
      location: data.location,
      category: data.category,
      price: data.price ? Number(data.price) : undefined,
      participants: data.participants_count || 0,
    };
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    throw error;
  }
};
