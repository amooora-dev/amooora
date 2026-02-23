import { useState, useEffect, useCallback } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { getRequestsReceived, getRecentMessagesReceived } from '../../features/friends';
import { getUpcomingEventsThisWeek, getFollowedCommunities } from '../../services/profile';

/**
 * Retorna a quantidade de notificações não lidas (mesma lógica da página Notificações).
 * Usado no badge do ícone de notificação no Header.
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
      const [requests, eventsWeek, recentSenders, communities] = await Promise.all([
        getRequestsReceived(),
        getUpcomingEventsThisWeek(profile.id),
        getRecentMessagesReceived(profile.id),
        getFollowedCommunities(profile.id),
      ]);
      const total =
        requests.length +
        eventsWeek.length +
        recentSenders.length +
        (communities.length > 0 ? 1 : 0);
      setCount(total);
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
