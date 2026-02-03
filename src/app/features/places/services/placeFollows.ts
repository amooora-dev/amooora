import { supabase } from '../../../infra/supabase';

/**
 * Seguir um local
 */
export async function followPlace(placeId: string): Promise<void> {
  try {
    console.log('🔍 [followPlace] Iniciando para placeId:', placeId);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('❌ [followPlace] Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    console.log('✅ [followPlace] Usuário autenticado:', user.id);

    // Verificar se já está seguindo
    const { data: existing } = await supabase
      .from('place_follows')
      .select('id')
      .eq('user_id', user.id)
      .eq('place_id', placeId)
      .single();

    if (existing) {
      console.log('ℹ️ [followPlace] Já está seguindo, não fazendo nada');
      return;
    }

    // Inserir novo follow
    console.log('💾 [followPlace] Inserindo novo follow:', { user_id: user.id, place_id: placeId });
    const { data: inserted, error } = await supabase
      .from('place_follows')
      .insert({
        user_id: user.id,
        place_id: placeId,
      })
      .select();

    if (error) {
      console.error('❌ [followPlace] Erro ao seguir local:', error);
      throw new Error(`Erro ao seguir local: ${error.message}`);
    }

    console.log('✅ [followPlace] Follow salvo com sucesso:', inserted);
  } catch (error) {
    console.error('❌ [followPlace] Erro ao seguir local:', error);
    throw error;
  }
}

/**
 * Deixar de seguir um local
 */
export async function unfollowPlace(placeId: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { error } = await supabase
      .from('place_follows')
      .delete()
      .eq('user_id', user.id)
      .eq('place_id', placeId);

    if (error) {
      console.error('Erro ao deixar de seguir:', error);
      throw new Error(`Erro ao deixar de seguir: ${error.message}`);
    }
  } catch (error) {
    console.error('Erro ao deixar de seguir local:', error);
    throw error;
  }
}

/**
 * Verificar se usuário está seguindo um local
 */
export async function isFollowingPlace(placeId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('place_follows')
      .select('id')
      .eq('user_id', user.id)
      .eq('place_id', placeId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao verificar follow:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Erro ao verificar follow do local:', error);
    return false;
  }
}

/**
 * Contar seguidores de um local
 */
export async function getPlaceFollowersCount(placeId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('place_follows')
      .select('*', { count: 'exact', head: true })
      .eq('place_id', placeId);

    if (error) {
      console.error('Erro ao contar seguidores:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Erro ao contar seguidores do local:', error);
    return 0;
  }
}
