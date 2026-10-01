import { useQuery } from '@tanstack/react-query';
import { useChain } from './useChain';
import { getApiClient } from '../api/endpoints';
import { queryKeys } from '../core/query/queryKeys';

export function useQuoteAssets() {
  const { chainId } = useChain();
  const api = getApiClient(chainId);

  return useQuery({
    queryKey: queryKeys.config.quoteAssets(chainId),
    queryFn: () => api.config.quoteAssets(),
    staleTime: 5 * 60 * 1000,
  });
}
