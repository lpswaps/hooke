import { useQuery } from '@tanstack/react-query';
import { useChain } from './useChain';
import { getApiClient } from '../api/endpoints';
import { queryKeys } from '../core/query/queryKeys';

export function useTrades(address, { page = 1, pageSize = 50, enabled = true } = {}) {
  const { chainId } = useChain();
  const api = getApiClient(chainId);
  const params = { page, pageSize };

  return useQuery({
    queryKey: queryKeys.tokens.trades(chainId, address, params),
    queryFn: () => api.tokens.trades(address, params),
    enabled: enabled && Boolean(address),
    placeholderData: (previous) => previous,
  });
}
