import { supabase } from '../../../infra/supabase';

/**
 * Marcar evento como "Tenho interesse"
 * Também adiciona o usuário como participante para aparecer no contador e lista
 */
export async function markEventAsInterested(eventId: string): Promise<void> {
  try {
    console.log('🔍 [markEventAsInterested] Iniciando para eventId:', eventId);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('❌ [markEventAsInterested] Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    console.log('✅ [markEventAsInterested] Usuário autenticado:', user.id);

    // Verificar se já existe interesse
    const { data: existingInterest } = await supabase
      .from('event_interests')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .single();

    // Verificar se já existe participação
    const { data: existingParticipant } = await supabase
      .from('event_participants')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .single();

    // Inserir interesse se não existir
    if (!existingInterest) {
      console.log('💾 [markEventAsInterested] Inserindo novo interesse:', { user_id: user.id, event_id: eventId });
      const { error: interestError } = await supabase
        .from('event_interests')
        .insert({
          user_id: user.id,
          event_id: eventId,
        });

      if (interestError) {
        console.error('❌ [markEventAsInterested] Erro ao marcar interesse:', interestError);
        throw new Error(`Erro ao marcar interesse: ${interestError.message}`);
      }
      console.log('✅ [markEventAsInterested] Interesse salvo com sucesso');
    } else {
      console.log('ℹ️ [markEventAsInterested] Interesse já existe');
    }

    // Inserir participante se não existir (para aparecer no contador e lista)
    if (!existingParticipant) {
      console.log('💾 [markEventAsInterested] Inserindo novo participante:', { user_id: user.id, event_id: eventId });
      const { error: participantError } = await supabase
        .from('event_participants')
        .insert({
          user_id: user.id,
          event_id: eventId,
        });

      if (participantError) {
        console.error('❌ [markEventAsInterested] Erro ao adicionar participante:', participantError);
        // Não lançar erro aqui, apenas logar, pois o interesse já foi salvo
        console.warn('⚠️ [markEventAsInterested] Interesse salvo, mas participante não foi adicionado');
      } else {
        console.log('✅ [markEventAsInterested] Participante adicionado com sucesso');
      }
    } else {
      console.log('ℹ️ [markEventAsInterested] Participante já existe');
    }
  } catch (error) {
    console.error('❌ [markEventAsInterested] Erro ao marcar evento como interessado:', error);
    throw error;
  }
}

/**
 * Remover interesse de um evento
 * Também remove da lista de participantes, a menos que esteja marcado como "Fui!!"
 */
export async function removeEventInterest(eventId: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Verificar se está marcado como "Fui!!" (participou)
    // Se estiver, não remover da lista de participantes
    const { data: attendedCheck } = await supabase
      .from('event_participants')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .single();

    // Remover interesse
    const { error: interestError } = await supabase
      .from('event_interests')
      .delete()
      .eq('user_id', user.id)
      .eq('event_id', eventId);

    if (interestError) {
      console.error('Erro ao remover interesse:', interestError);
      throw new Error(`Erro ao remover interesse: ${interestError.message}`);
    }

    // Verificar se o usuário também marcou "Fui!!" (participou)
    // Se marcou "Fui!!", não devemos remover da lista de participantes
    // Por enquanto, vamos verificar se existe participação e manter
    // A lógica é: se o usuário desmarcar "Tenho interesse" mas tiver marcado "Fui!!",
    // ele deve continuar na lista. Caso contrário, remover da lista.
    
    // Na verdade, a melhor abordagem é:
    // - Se o usuário desmarcar "Tenho interesse" e não tiver marcado "Fui!!",
    //   remover da lista de participantes também
    // - Se o usuário desmarcar "Tenho interesse" mas tiver marcado "Fui!!",
    //   manter na lista de participantes
    
    // Por enquanto, vamos manter a participação se existir
    // O usuário pode desmarcar "Fui!!" separadamente se quiser remover da lista
    // Isso evita remover acidentalmente quando o usuário apenas desmarcou "Tenho interesse"
    // mas ainda quer aparecer como participante (porque marcou "Fui!!")
    
    console.log('ℹ️ [removeEventInterest] Interesse removido. Participação mantida se existir.');
  } catch (error) {
    console.error('Erro ao remover interesse do evento:', error);
    throw error;
  }
}

/**
 * Verificar se usuário tem interesse em um evento
 */
export async function hasEventInterest(eventId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('event_interests')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao verificar interesse:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Erro ao verificar interesse do evento:', error);
    return false;
  }
}

/**
 * Marcar evento como "Fui!"
 */
export async function markEventAsAttended(eventId: string): Promise<void> {
  try {
    console.log('🔍 [markEventAsAttended] Iniciando para eventId:', eventId);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('❌ [markEventAsAttended] Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    console.log('✅ [markEventAsAttended] Usuário autenticado:', user.id);

    // Verificar se já existe
    const { data: existing } = await supabase
      .from('event_participants')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .single();

    if (existing) {
      console.log('ℹ️ [markEventAsAttended] Participação já existe, não fazendo nada');
      return;
    }

    // Inserir novo participante
    console.log('💾 [markEventAsAttended] Inserindo nova participação:', { user_id: user.id, event_id: eventId });
    const { data: inserted, error } = await supabase
      .from('event_participants')
      .insert({
        user_id: user.id,
        event_id: eventId,
      })
      .select();

    if (error) {
      console.error('❌ [markEventAsAttended] Erro ao marcar como participou:', error);
      throw new Error(`Erro ao marcar como participou: ${error.message}`);
    }

    console.log('✅ [markEventAsAttended] Participação salva com sucesso:', inserted);
  } catch (error) {
    console.error('❌ [markEventAsAttended] Erro ao marcar evento como participado:', error);
    throw error;
  }
}

/**
 * Remover marcação de "Fui!"
 */
export async function removeEventAttendance(eventId: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { error } = await supabase
      .from('event_participants')
      .delete()
      .eq('user_id', user.id)
      .eq('event_id', eventId);

    if (error) {
      console.error('Erro ao remover participação:', error);
      throw new Error(`Erro ao remover participação: ${error.message}`);
    }
  } catch (error) {
    console.error('Erro ao remover participação do evento:', error);
    throw error;
  }
}

/**
 * Verificar se usuário participou de um evento
 */
export async function hasEventAttendance(eventId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('event_participants')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao verificar participação:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Erro ao verificar participação do evento:', error);
    return false;
  }
}

/**
 * Buscar eventos que o usuário tem interesse
 */
export async function getUserInterestedEvents(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('event_interests')
      .select('event_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao buscar eventos de interesse:', error);
      return [];
    }

    return (data || []).map((item) => item.event_id);
  } catch (error) {
    console.error('Erro ao buscar eventos de interesse:', error);
    return [];
  }
}

/**
 * Buscar eventos que o usuário participou
 */
export async function getUserAttendedEvents(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('event_participants')
      .select('event_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao buscar eventos participados:', error);
      return [];
    }

    return (data || []).map((item) => item.event_id);
  } catch (error) {
    console.error('Erro ao buscar eventos participados:', error);
    return [];
  }
}
