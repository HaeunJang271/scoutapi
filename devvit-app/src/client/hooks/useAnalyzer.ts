import { useCallback, useEffect, useState } from 'react';
import type { DashboardData, InitResponse, RefreshResponse } from '../../shared/api';

export function useAnalyzer() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [username, setUsername] = useState('');
  const [isModerator, setIsModerator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchInit = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/init');
      const json = (await res.json()) as InitResponse | { status: string; message: string };
      if ('status' in json && json.status === 'error') {
        setError(json.message);
        return;
      }
      const init = json as InitResponse;
      setUsername(init.username);
      setData(init.data);
      setIsModerator(init.isModerator);
    } catch {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError('');
    try {
      const res = await fetch('/api/refresh', { method: 'POST' });
      const json = (await res.json()) as RefreshResponse | { status: string; message: string };
      if ('status' in json && json.status === 'error') {
        setError(json.message);
        return;
      }
      setData((json as RefreshResponse).data);
    } catch {
      setError('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchInit();
  }, [fetchInit]);

  return { data, username, isModerator, loading, refreshing, error, refresh, refetch: fetchInit };
}
