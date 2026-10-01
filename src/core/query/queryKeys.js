export const queryKeys = {
  tokens: {
    all: (chainId) => ['tokens', chainId],
    list: (chainId, params) => ['tokens', chainId, 'list', params],
    detail: (chainId, address) => ['tokens', chainId, 'detail', address],
    graduated: (chainId, params) => ['tokens', chainId, 'graduated', params],
    candles: (chainId, address, params) => ['tokens', chainId, 'candles', address, params],
    trades: (chainId, address, params) => ['tokens', chainId, 'trades', address, params],
  },
  config: {
    quoteAssets: (chainId) => ['config', chainId, 'quote-assets'],
  },
};
