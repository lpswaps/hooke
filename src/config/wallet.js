import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { bsc, bscTestnet } from 'wagmi/chains';
import { defineChain } from 'viem';

export const robinhood = defineChain({
  id: 46630,
  name: 'Robinhood',
  nativeCurrency: { name: 'Robinhood ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.ankr.com/eth'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://etherscan.io' },
  },
});

export const walletConfig = getDefaultConfig({
  appName: 'Hooke',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [bscTestnet, bsc, robinhood],
});