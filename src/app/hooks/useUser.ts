import { useState, useEffect } from 'react';
import { User } from '../types';
import { getCurrentUser } from '../services/users';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar usuário'));
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, loading, error };
};
