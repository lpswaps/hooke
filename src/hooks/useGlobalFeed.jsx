import { useCallback, useEffect, useRef, useState } from 'react';
import { useChain } from './useChain';
import { useWebSocket } from './useWebSocket';

const MAX_FEED_ITEMS = 50;

/**
 * 只推送大额交易通知(超过阈值的 Swap,比如 2 BNB / 2000U 以上)。
 * 新建代币/毕业事件不走 WS,由前端 REST 轮询获取。
 */
export function useGlobalFeed({ enabled = true } = {}) {
    const { chainId } = useChain();
    const [items, setItems] = useState([]);
    const seqRef = useRef(0);

    const handleMessage = useCallback((msg) => {
        if (msg?.type !== 'big_trade') return;

        const item = {
            ...msg,
            id: `${msg.type}-${Date.now()}-${seqRef.current++}`,
            receivedAt: Date.now(),
        };
        setItems((prev) => [item, ...prev].slice(0, MAX_FEED_ITEMS));
    }, []);

    const { status } = useWebSocket('/ws/feed', handleMessage, { enabled });

    const clear = useCallback(() => setItems([]), []);

    // 切链后,旧链的数据不应继续展示
    useEffect(() => {
        clear();
    }, [chainId, clear]);

    return { items, status, clear };
}