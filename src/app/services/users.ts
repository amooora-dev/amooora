import { User } from '../types';
import { supabase } from '../infra/supabase';

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Perfil não encontrado
      }
      console.error('Erro ao buscar perfil do usuário:', error);
      throw new Error(`Erro ao buscar perfil do usuário: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar || undefined,
      phone: data.phone || undefined,
      bio: data.bio || undefined,
    };
  } catch (error) {
    console.error('Erro ao buscar usuário atual:', error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Erro ao buscar usuário:', error);
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar || undefined,
      phone: data.phone || undefined,
      bio: data.bio || undefined,
    };
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
};