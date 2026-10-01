import { ThemeProvider, CssBaseline } from "@mui/material";

import { QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { ChainProvider } from './ChainProvider';
import { queryClient } from '../lib/queryClient';
import theme from '../styles/theme';
import { walletConfig } from '../config/wallet';


export default function AppProviders({ children }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <WagmiProvider config={walletConfig}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitProvider theme={darkTheme({
                        accentColor: '#C7F84C',
                        accentColorForeground: '#080A08',
                        borderRadius: 'medium',
                        overlayBlur: 'small',
                    })}>
                        <ChainProvider>{children}</ChainProvider>
                    </RainbowKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </ThemeProvider>
    );
}
