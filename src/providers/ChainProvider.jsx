import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CHAINS, DEFAULT_CHAIN_ID, getChain } from '../config/chains';

const STORAGE_KEY = 'hooke:active-chain';
const ChainContext = createContext(null);

function getInitialChainId() {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored ? getChain(stored).id : DEFAULT_CHAIN_ID;
    } catch {
        return DEFAULT_CHAIN_ID;
    }
}

export function ChainProvider({ children }) {
    const [chainId, setChainIdState] = useState(getInitialChainId);

    const setChainId = useCallback((nextChainId) => {
        const next = getChain(nextChainId).id;
        setChainIdState(next);
        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // Ignore storage failures; chain state still works for this session.
        }
    }, []);

    const chain = useMemo(() => getChain(chainId), [chainId]);

    const value = useMemo(() => ({
        chainId,
        chain,
        chains: CHAINS,
        setChainId,
    }), [chainId, chain, setChainId]);

    return <ChainContext.Provider value={value}>{children}</ChainContext.Provider>;
}

export function useChain() {
    const value = useContext(ChainContext);
    if (!value) {
        throw new Error('useChain must be used inside ChainProvider');
    }
    return value;
}
