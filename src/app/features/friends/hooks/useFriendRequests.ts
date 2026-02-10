import { useState, useEffect, useCallback } from 'react';
import type { FriendRequest } from '../types';
import { getRequestsSent, getRequestsReceived } from '../services/friends';

export function useFriendRequests() {
  const [sent, setSent] = useState<FriendRequest[]>([]);
  const [received, setReceived] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const [sentData, receivedData] = await Promise.all([
        getRequestsSent(),
        getRequestsReceived(),
      ]);
      setSent(sentData);
      setReceived(receivedData);
    } catch (e) {
      console.error('[useFriendRequests]', e);
      setSent([]);
      setReceived([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { sent, received, loading, refetch };
}
