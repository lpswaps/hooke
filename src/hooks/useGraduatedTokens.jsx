import { useQuery } from '@tanstack/react-query';
import { useChain } from './useChain';
import { getApiClient } from '../api/endpoints';
import { queryKeys } from '../core/query/queryKeys';

export function useGraduatedTokens({ page = 1, pageSize = 10, pollInterval = 15000 } = {}) {
  const { chainId } = useChain();
  const params = { page, pageSize };
  const api = getApiClient(chainId);

  return useQuery({
    queryKey: queryKeys.tokens.graduated(chainId, params),
    queryFn: () => api.tokens.graduated(params),
    refetchInterval: pollInterval,
    placeholderData: (previous) => previous,
  });
}
