import { supabase } from '../../infra/supabase';
import type { AccessRole, AccessStatus } from '../hooks/useAdmin';

export interface AdminProfileRow {
  id: string;
  email: string | null;
  name: string | null;
  role: AccessRole;
  status: AccessStatus;
  created_at?: string | null;
  updated_at?: string | null;
}

export async function adminListProfiles(): Promise<AdminProfileRow[]> {
  const { data, error } = await supabase.rpc('admin_list_profiles');
  if (error) {
    throw new Error(error.message);
  }
  return (data || []) as AdminProfileRow[];
}

export async function adminSetProfileAccess(params: {
  targetUserId: string;
  newRole: AccessRole;
  newStatus: AccessStatus;
}): Promise<void> {
  const { error } = await supabase.rpc('admin_set_profile_access', {
    target_user_id: params.targetUserId,
    new_role: params.newRole,
    new_status: params.newStatus,
  });
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Deleta um ou múltiplos usuários (apenas para admin_geral)
 * Deleta do auth.users, que cascateia para profiles automaticamente
 * 
 * Tenta usar a função com array primeiro, se falhar, deleta um por vez
 */
export async function adminDeleteUsers(userIds: string[]): Promise<void> {
  if (userIds.length === 0) {
    throw new Error('Nenhum usuário selecionado para deletar');
  }

  // Tentar deletar todos de uma vez (função com array)
  const { error: arrayError } = await supabase.rpc('admin_delete_users', {
    user_ids: userIds,
  });

  // Se a função com array não existir ou falhar, deletar um por vez
  if (arrayError && (arrayError.message.includes('Could not find the function') || arrayError.message.includes('schema cache'))) {
    console.log('⚠️ Função com array não encontrada, deletando um por vez...');
    
    // Deletar um por vez usando a função alternativa
    for (const userId of userIds) {
      const { error: singleError } = await supabase.rpc('admin_delete_user_single', {
        target_user_id: userId,
      });

      if (singleError) {
        throw new Error(`Erro ao deletar usuário ${userId}: ${singleError.message}`);
      }
    }
  } else if (arrayError) {
    throw new Error(arrayError.message);
  }
}

