import { supabase } from '../../../infra/supabase';

export interface Community {
  id: string;
  name: string;
  description: string;
  image?: string;
  imageUrl?: string;
  icon?: string;
  category?: string;
  membersCount?: number;
  postsCount?: number;
  isActive?: boolean;
  createdAt?: string;
}

/**
 * Buscar todas as comunidades ativas
 */
export const getCommunities = async (): Promise<Community[]> => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro ao buscar comunidades:', error);
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
    console.error('❌ Erro ao buscar comunidades:', error);
    throw error;
  }
};

/**
 * Buscar comunidade por ID
 */
export const getCommunityById = async (id: string): Promise<Community | null> => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('❌ Erro ao buscar comunidade:', error);
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      image: data.image || undefined,
      imageUrl: data.image || undefined,
      icon: data.icon || undefined,
      category: data.category || undefined,
      membersCount: data.members_count || 0,
      postsCount: data.posts_count || 0,
      isActive: data.is_active ?? true,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('❌ Erro ao buscar comunidade:', error);
    throw error;
  }
};

/**
 * Criar nova comunidade
 */
export const createCommunity = async (communityData: {
  name: string;
  description: string;
  image?: string;
  icon?: string;
  category?: string;
}): Promise<Community> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    const { data, error } = await supabase
      .from('communities')
      .insert({
        name: communityData.name,
        description: communityData.description,
        image: communityData.image || null,
        icon: communityData.icon || null,
        category: communityData.category || null,
        is_active: true,
        members_count: 0,
        posts_count: 0,
        created_by: userId || null,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar comunidade:', error);
      throw new Error(`Erro ao criar comunidade: ${error.message}`);
    }

    if (!data) {
      throw new Error('Erro ao criar comunidade: nenhum dado retornado');
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      image: data.image || undefined,
      imageUrl: data.image || undefined,
      icon: data.icon || undefined,
      category: data.category || undefined,
      membersCount: data.members_count || 0,
      postsCount: data.posts_count || 0,
      isActive: data.is_active ?? true,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('❌ Erro ao criar comunidade:', error);
    throw error;
  }
};

/**
 * Atualizar comunidade
 */
export const updateCommunity = async (
  id: string,
  communityData: {
    name?: string;
    description?: string;
    image?: string;
    icon?: string;
    category?: string;
    isActive?: boolean;
  }
): Promise<Community> => {
  try {
    const updateData: any = {};
    
    if (communityData.name !== undefined) updateData.name = communityData.name;
    if (communityData.description !== undefined) updateData.description = communityData.description;
    if (communityData.image !== undefined) updateData.image = communityData.image || null;
    if (communityData.icon !== undefined) updateData.icon = communityData.icon || null;
    if (communityData.category !== undefined) updateData.category = communityData.category || null;
    if (communityData.isActive !== undefined) updateData.is_active = communityData.isActive;

    const { data, error } = await supabase
      .from('communities')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao atualizar comunidade:', error);
      throw new Error(`Erro ao atualizar comunidade: ${error.message}`);
    }

    if (!data) {
      throw new Error('Erro ao atualizar comunidade: nenhum dado retornado');
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      image: data.image || undefined,
      imageUrl: data.image || undefined,
      icon: data.icon || undefined,
      category: data.category || undefined,
      membersCount: data.members_count || 0,
      postsCount: data.posts_count || 0,
      isActive: data.is_active ?? true,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('❌ Erro ao atualizar comunidade:', error);
    throw error;
  }
};

/**
 * Deletar comunidade (soft delete - marcar como inativa)
 */
export const deleteCommunity = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('communities')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('❌ Erro ao deletar comunidade:', error);
      throw new Error(`Erro ao deletar comunidade: ${error.message}`);
    }
  } catch (error) {
    console.error('❌ Erro ao deletar comunidade:', error);
    throw error;
  }
};

/**
 * Associar usuário a uma comunidade
 */
export const joinCommunity = async (communityId: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('community_members')
      .insert({
        community_id: communityId,
        user_id: userId,
      });

    if (error) {
      // Se já estiver associado, ignorar erro
      if (error.code === '23505') {
        console.log('Usuário já está associado à comunidade');
        return;
      }
      console.error('❌ Erro ao associar usuário à comunidade:', error);
      throw new Error(`Erro ao associar usuário: ${error.message}`);
    }

    // Incrementar contador de membros
    await supabase.rpc('increment_community_members', { community_id_param: communityId });
  } catch (error) {
    console.error('❌ Erro ao associar usuário à comunidade:', error);
    throw error;
  }
};

/**
 * Remover associação de usuário a uma comunidade
 */
export const leaveCommunity = async (communityId: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('community_members')
      .delete()
      .eq('community_id', communityId)
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Erro ao remover associação:', error);
      throw new Error(`Erro ao remover associação: ${error.message}`);
    }

    // Decrementar contador de membros
    await supabase.rpc('decrement_community_members', { community_id_param: communityId });
  } catch (error) {
    console.error('❌ Erro ao remover associação:', error);
    throw error;
  }
};

/**
 * Verificar se usuário está associado a uma comunidade
 */
export const isUserMember = async (communityId: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('community_members')
      .select('id')
      .eq('community_id', communityId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Erro ao verificar associação:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('❌ Erro ao verificar associação:', error);
    return false;
  }
};
