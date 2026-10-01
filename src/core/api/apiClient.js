import { httpRequest, buildQueryString } from './httpClient';

export function createApiClient(chainId) {
  const get = (path, params) => httpRequest(`${path}${buildQueryString(params)}`, { chainId });

  return Object.freeze({
    tokens: {
      list: ({ category, search, page, pageSize }) =>
        get('/api/tokens', { category, search, page, pageSize }),
      detail: (address) => get(`/api/tokens/${address}`),
      graduated: ({ page, pageSize }) =>
        get('/api/tokens/graduated', { page, pageSize }),
      candles: (address, { interval, limit }) =>
        get(`/api/tokens/${address}/candles`, { interval, limit }),
      trades: (address, { page, pageSize }) =>
        get(`/api/tokens/${address}/trades`, { page, pageSize }),
    },
    config: {
      quoteAssets: () => get('/api/config/quote-assets'),
    },
  });
}
