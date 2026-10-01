import { useQuery } from '@tanstack/react-query';
import { useChain } from './useChain';
import { getApiClient } from '../api/endpoints';
import { queryKeys } from '../core/query/queryKeys';

export function useTokenList(category, { search = '', page = 1, pageSize = 20, pollInterval } = {}) {
  const { chainId } = useChain();
  const params = { category, search, page, pageSize };
  const api = getApiClient(chainId);
  return useQuery({
    queryKey: queryKeys.tokens.list(chainId, params),
    queryFn: () => api.tokens.list(params),
    refetchInterval: pollInterval ?? (category === 'hot' ? 15000 : false),
    placeholderData: (previous) => previous,
  });
}
