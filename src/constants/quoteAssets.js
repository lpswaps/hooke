import { shortenAddress } from '../utils/format';

/**
 * 配对资产表(BSC Testnet)。key 必须是小写地址。
 * 以后换链/加币,只改这里,不用碰组件。
 */
export const QUOTE_ASSETS = {
    '0xae13d989dac2f0debff460ac112a837c89baa7cd': { symbol: 'WBNB', decimals: 18 },
    '0x337610d27c682e347c9cd60bd4b3b107c9d34ddd': { symbol: 'USDT', decimals: 18 },
    '0x64544969ed7ebf5f083679233325356ebe738930': { symbol: 'USDC', decimals: 18 },
    '0xec5dcb5dbf4b114c9d0f65bccab49ec54f6a0867': { symbol: 'DAI', decimals: 18 },
};

/** 未收录的资产:用短地址兜底,避免界面出现一个莫名其妙的 "?" */
export function getQuoteAsset(address) {
    return (
        QUOTE_ASSETS[address?.toLowerCase()] ?? {
            symbol: address ? shortenAddress(address, 4) : '?',
            decimals: 18,
        }
    );
}