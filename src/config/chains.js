const createChain = (config) => Object.freeze({
  ...config,
  explorer: Object.freeze(config.explorer),
  nativeCurrency: Object.freeze(config.nativeCurrency),
  features: Object.freeze(config.features || {}),
});

export const CHAINS = Object.freeze([
  createChain({
    id: 'bsc',
    label: 'BSC',
    shortLabel: 'BSC',
    color: '#F0B90B',
    nativeCurrency: { symbol: 'BNB', decimals: 18 },
    explorer: {
      tx: 'https://testnet.bscscan.com/tx/',
      address: 'https://testnet.bscscan.com/address/',
    },
    features: {
      testnet: true,
    },
  }),
  createChain({
    id: 'robinhood',
    label: 'Robinhood',
    shortLabel: 'RH',
    color: '#CCFF00',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    explorer: {
      tx: '',
      address: '',
    },
    features: {
      testnet: true,
    },
  }),
]);

export const DEFAULT_CHAIN_ID = CHAINS[0].id;

export const CHAIN_MAP = Object.freeze(
  Object.fromEntries(CHAINS.map((chain) => [chain.id, chain]))
);

export function getChain(chainId) {
  return CHAIN_MAP[chainId] || CHAIN_MAP[DEFAULT_CHAIN_ID];
}
