import { useState, useEffect } from 'react';
import { supabase } from '../../infra/supabase';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Verificar sessão inicial
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isAuthenticated, loading };
};
