import { useEffect, useState } from 'react';

/**
 * 返回"最新一条"的 id,并在 duration 后自动清空,用于短暂高亮新数据。
 * 依赖的是 latestId 而不是整个 items 数组,
 * 所以列表里其他变化(如 slice/clear)不会重置计时器。
 */
export function useNewestHighlight(items, duration = 2000) {
    const [highlightedId, setHighlightedId] = useState(null);
    const latestId = items[0]?.id;

    useEffect(() => {
        if (!latestId) return undefined;

        setHighlightedId(latestId);
        const timer = setTimeout(() => setHighlightedId(null), duration);
        return () => clearTimeout(timer);
    }, [latestId, duration]);

    return highlightedId;
}