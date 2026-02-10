import { useState, useEffect, useCallback } from 'react';
import type { ConnectionStatus } from '../types';
import { getConnectionStatus } from '../services/friends';

export function useConnectionStatus(otherUserId: string | undefined) {
  const [status, setStatus] = useState<ConnectionStatus>('none');
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!otherUserId) {
      setStatus('none');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const s = await getConnectionStatus(otherUserId);
      setStatus(s);
    } catch (e) {
      console.error('[useConnectionStatus]', e);
      setStatus('none');
    } finally {
      setLoading(false);
    }
  }, [otherUserId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { status, loading, refetch };
}
