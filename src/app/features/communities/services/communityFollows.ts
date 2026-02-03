import { supabase } from '../../../infra/supabase';
import { joinCommunity, leaveCommunity, isUserMember } from './communities';

/**
 * Seguir uma comunidade
 */
export async function followCommunity(communityId: string): Promise<void> {
  try {
    console.log('🔍 [followCommunity] Iniciando para communityId:', communityId);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('❌ [followCommunity] Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    console.log('✅ [followCommunity] Usuário autenticado:', user.id);

    // Verificar se já está seguindo
    const alreadyFollowing = await isUserMember(communityId, user.id);
    
    if (alreadyFollowing) {
      console.log('ℹ️ [followCommunity] Já está seguindo, não fazendo nada');
      return;
    }

    // Seguir comunidade
    console.log('💾 [followCommunity] Seguindo comunidade:', { user_id: user.id, community_id: communityId });
    await joinCommunity(communityId, user.id);

    console.log('✅ [followCommunity] Follow salvo com sucesso');
  } catch (error) {
    console.error('❌ [followCommunity] Erro ao seguir comunidade:', error);
    throw error;
  }
}

/**
 * Deixar de seguir uma comunidade
 */
export async function unfollowCommunity(communityId: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    await leaveCommunity(communityId, user.id);
  } catch (error) {
    console.error('Erro ao deixar de seguir:', error);
    throw new Error(`Erro ao deixar de seguir: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

/**
 * Verificar se usuário está seguindo uma comunidade
 */
export async function isFollowingCommunity(communityId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return false;
    }

    return await isUserMember(communityId, user.id);
  } catch (error) {
    console.error('Erro ao verificar follow:', error);
    return false;
  }
}

/**
 * Contar seguidores de uma comunidade
 */
export async function getCommunityFollowersCount(communityId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('community_members')
      .select('*', { count: 'exact', head: true })
      .eq('community_id', communityId);

    if (error) {
      console.error('Erro ao contar seguidores:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Erro ao contar seguidores da comunidade:', error);
    return 0;
  }
}
