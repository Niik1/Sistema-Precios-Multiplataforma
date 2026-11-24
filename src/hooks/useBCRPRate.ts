import { useState, useEffect, useCallback } from 'react';
import { BCRPRateData, fetchLiveBCRPRate } from '../services/bcrp.api';

export function useBCRPRate() {
  const [rate, setRate] = useState<BCRPRateData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadRate = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchLiveBCRPRate(forceRefresh);
      setRate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo obtener el TC');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRate(false);
  }, [loadRate]);

  const refresh = useCallback(() => {
    return loadRate(true);
  }, [loadRate]);

  return { rate, isLoading, error, refresh };
}
