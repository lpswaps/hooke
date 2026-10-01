import { useQuery } from '@tanstack/react-query';
import { useChain } from './useChain';
import { getApiClient } from '../api/endpoints';
import { queryKeys } from '../core/query/queryKeys';

export function useCandles(address, { interval = '1m', limit = 500, enabled = true } = {}) {
  const { chainId } = useChain();
  const api = getApiClient(chainId);
  const params = { interval, limit };

  return useQuery({
    queryKey: queryKeys.tokens.candles(chainId, address, params),
    queryFn: () => api.tokens.candles(address, params),
    enabled: enabled && Boolean(address),
  });
}
