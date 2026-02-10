import { useState, useEffect, useCallback } from 'react';
import type { FriendProfile } from '../types';
import { getFriends } from '../services/friends';

export function useFriends() {
  const [friends, setFriends] = useState<FriendProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFriends();
      setFriends(data);
    } catch (e) {
      console.error('[useFriends]', e);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { friends, loading, refetch };
}
