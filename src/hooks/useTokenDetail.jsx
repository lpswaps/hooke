import { useQuery } from '@tanstack/react-query';
import { useChain } from './useChain';
import { getApiClient } from '../api/endpoints';
import { queryKeys } from '../core/query/queryKeys';

export function useTokenDetail(address, { pollInterval = 10000 } = {}) {
  const { chainId } = useChain();
  const api = getApiClient(chainId);

  return useQuery({
    queryKey: queryKeys.tokens.detail(chainId, address),
    queryFn: () => api.tokens.detail(address),
    enabled: Boolean(address),
    refetchInterval: pollInterval,
  });
}
