import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../infra/supabase';

export type AccessRole =
  | 'admin_geral'
  | 'user_viewer'
  | 'admin_locais'
  | 'admin_eventos'
  | 'admin_servicos';

export type AccessStatus = 'active' | 'blocked' | 'inactive';

export function useAdmin() {
  const [loading, setLoading] = useState(true);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [role, setRole] = useState<AccessRole | null>(null);
  const [status, setStatus] = useState<AccessStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.log('⚠️ Erro ao buscar usuário no useAdmin:', authError);
          setAuthUserId(null);
          setRole(null);
          setStatus(null);
          setError(authError.message);
          setLoading(false);
          return;
        }

        if (!user) {
          setAuthUserId(null);
          setRole(null);
          setStatus(null);
          setLoading(false);
          return;
        }

        setAuthUserId(user.id);

        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, status')
            .eq('id', user.id)
            .single();

          if (profileError) {
            // Falha comum antes do SQL subir: coluna inexistente / perfil não criado ainda.
            // Mantemos o app funcional, mas sem liberar admin.
            console.log('⚠️ Erro ao buscar perfil no useAdmin:', profileError);
            setRole('user_viewer');
            setStatus('active');
            setError(profileError.message);
            setLoading(false);
            return;
          }

          setRole((profile?.role ?? 'user_viewer') as AccessRole);
          setStatus((profile?.status ?? 'active') as AccessStatus);
          setLoading(false);
        } catch (profileError) {
          console.error('❌ Erro inesperado ao buscar perfil:', profileError);
          setRole('user_viewer');
          setStatus('active');
          setError(profileError instanceof Error ? profileError.message : 'Erro desconhecido');
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Erro inesperado no useAdmin:', error);
        setAuthUserId(null);
        setRole(null);
        setStatus(null);
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
        setLoading(false);
      }
    };

    load();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      load();
    });
    return () => subscription.unsubscribe();
  }, []);

  const isAuthenticated = !!authUserId;
  const isActive = status === 'active';

  const isAdminGeral = isAuthenticated && isActive && role === 'admin_geral';
  const isAnyAdmin =
    isAuthenticated &&
    isActive &&
    (role === 'admin_geral' ||
      role === 'admin_locais' ||
      role === 'admin_eventos' ||
      role === 'admin_servicos');

  const canManagePlaces = isAuthenticated && isActive && (isAdminGeral || role === 'admin_locais');
  const canManageEvents = isAuthenticated && isActive && (isAdminGeral || role === 'admin_eventos');
  const canManageServices = isAuthenticated && isActive && (isAdminGeral || role === 'admin_servicos');

  return useMemo(
    () => ({
      loading,
      error,
      authUserId,
      role,
      status,
      isAuthenticated,
      isActive,
      isAdmin: isAnyAdmin,
      isAdminGeral,
      canManagePlaces,
      canManageEvents,
      canManageServices,
    }),
    [
      loading,
      error,
      authUserId,
      role,
      status,
      isAuthenticated,
      isActive,
      isAnyAdmin,
      isAdminGeral,
      canManagePlaces,
      canManageEvents,
      canManageServices,
    ]
  );
}
