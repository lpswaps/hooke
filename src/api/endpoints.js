import { createApiClient } from '../core/api/apiClient';

export function getApiClient(chainId) {
  return createApiClient(chainId);
}

// Compatibility exports. New code should use getApiClient(chainId).
export function fetchTokenList(chainId, params) {
  return getApiClient(chainId).tokens.list(params);
}

export function fetchTokenDetail(chainId, address) {
  return getApiClient(chainId).tokens.detail(address);
}

export function fetchGraduatedTokens(chainId, params) {
  return getApiClient(chainId).tokens.graduated(params);
}

export function fetchCandles(chainId, address, params) {
  return getApiClient(chainId).tokens.candles(address, params);
}

export function fetchTrades(chainId, address, params) {
  return getApiClient(chainId).tokens.trades(address, params);
}

export function fetchQuoteAssets(chainId) {
  return getApiClient(chainId).config.quoteAssets();
}
