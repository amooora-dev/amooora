import { supabase } from '../../../infra/supabase';

/**
 * Marcar local como "Já fui" (frequentado)
 */
export async function markPlaceAsVisited(placeId: string): Promise<void> {
  try {
    console.log('🔍 [markPlaceAsVisited] Iniciando para placeId:', placeId);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('❌ [markPlaceAsVisited] Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    console.log('✅ [markPlaceAsVisited] Usuário autenticado:', user.id);

    // Verificar se já existe
    const { data: existing } = await supabase
      .from('visited_places')
      .select('id')
      .eq('user_id', user.id)
      .eq('place_id', placeId)
      .single();

    if (existing) {
      console.log('ℹ️ [markPlaceAsVisited] Visita já existe, não fazendo nada');
      return;
    }

    // Inserir nova visita
    console.log('💾 [markPlaceAsVisited] Inserindo nova visita:', { user_id: user.id, place_id: placeId });
    const { data: inserted, error } = await supabase
      .from('visited_places')
      .insert({
        user_id: user.id,
        place_id: placeId,
      })
      .select();

    if (error) {
      console.error('❌ [markPlaceAsVisited] Erro ao marcar como visitado:', error);
      throw new Error(`Erro ao marcar como visitado: ${error.message}`);
    }

    console.log('✅ [markPlaceAsVisited] Visita salva com sucesso:', inserted);
  } catch (error) {
    console.error('❌ [markPlaceAsVisited] Erro ao marcar local como visitado:', error);
    throw error;
  }
}

/**
 * Remover marcação de "Já fui"
 */
export async function removePlaceVisit(placeId: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { error } = await supabase
      .from('visited_places')
      .delete()
      .eq('user_id', user.id)
      .eq('place_id', placeId);

    if (error) {
      console.error('Erro ao remover visita:', error);
      throw new Error(`Erro ao remover visita: ${error.message}`);
    }
  } catch (error) {
    console.error('Erro ao remover visita do local:', error);
    throw error;
  }
}

/**
 * Verificar se usuário visitou um local
 */
export async function hasPlaceVisit(placeId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('visited_places')
      .select('id')
      .eq('user_id', user.id)
      .eq('place_id', placeId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao verificar visita:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Erro ao verificar visita do local:', error);
    return false;
  }
}
