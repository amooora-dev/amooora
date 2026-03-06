import { useState, useEffect, useCallback } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { getRecentMessagesReceived } from '../../features/friends';

/**
 * Retorna a quantidade de notificações não lidas (mesma lógica da página Notificações).
 * Considera apenas mensagens de amigos (e futuramente respostas a publicações).
 */
export function useUnreadNotificationsCount() {
  const { profile } = useProfile();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!profile?.id) {
      setCount(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const recentSenders = await getRecentMessagesReceived(profile.id);
      setCount(recentSenders.length);
    } catch (e) {
      console.error('[useUnreadNotificationsCount]', e);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { count, loading, refresh };
}
