import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { useChain } from '../../../providers/ChainProvider';
import { queryKeys } from '../../../core/query/queryKeys';
import { applyTradeToCandles } from '../components/tradingview/candleAggregator';

/* ===================== 常量 ===================== */

/** 交易列表首页容量 —— 必须和 useTrades 的默认 pageSize 一致 */
const TRADE_PAGE_SIZE = 50;

/** K 线缓存里保留的最大根数 —— 要和 useTokenLiveFeed 之外的 useCandles limit 一致 */
const CANDLE_MAX_BARS = 500;

const INTERVAL_SECONDS = {
  '1s': 1,
  '1m': 60,
  '5m': 300,
  '15m': 900,
  '30m': 1800,
  '1h': 3600,
  '4h': 14400,
  '1d': 86400,
};

/* ===================== 工具函数 ===================== */

/** 统一转成 UTC 秒 */
function toSeconds(t) {
  if (t == null) return NaN;
  if (typeof t === 'number') {
    return t > 1e11 ? Math.floor(t / 1000) : Math.floor(t);
  }
  if (typeof t === 'string') {
    if (/^\d+(\.\d+)?$/.test(t)) {
      const n = Number(t);
      return n > 1e11 ? Math.floor(n / 1000) : Math.floor(n);
    }
    const ms = Date.parse(t);
    return Number.isFinite(ms) ? Math.floor(ms / 1000) : NaN;
  }
  return NaN;
}

/** 从对象里按候选字段名取第一个非空值 */
function pick(item, ...names) {
  for (const n of names) {
    if (item[n] != null) return item[n];
  }
  return undefined;
}


/* ===================== Hook 本体 ===================== */

/**
 * 订阅某代币的实时事件(swap / graduated)。
 * - trades 首页:WS 增量 prepend + txHash 去重
 * - tokenDetail:更新最新价 / 毕业进度
 * - candles:   本地聚合,**不请求后端**
 *
 * @param {string} address
 * @param {object} options
 * @param {boolean} [options.enabled=true]
 * @param {string}  [options.interval='1m'] 当前图表周期,须和 useCandles 一致
 */
export function useTokenLiveFeed(
  address,
  { enabled = true, interval = '1m' } = {},
) {
  const queryClient = useQueryClient();
  const { chainId } = useChain();
  const intervalSec = INTERVAL_SECONDS[interval] ?? 60;

  // 用工厂函数构造 key,和 useTrades / useCandles 保持完全一致
  const tradesFirstPageKey = queryKeys.tokens.trades(chainId, address, {
    page: 1,
    pageSize: TRADE_PAGE_SIZE,
  });
  const candlesKey = queryKeys.tokens.candles(chainId, address, {
    interval,
    limit: CANDLE_MAX_BARS,
  });

  const handleMessage = useCallback(
    (msg) => {
      console.log('[live] ① 收到消息', msg);            // ① 有没有进来、真实结构是什么
      if (!address || !msg?.type) return;

      /* ---------- swap ---------- */
      if (msg.type === 'swap' && msg.data) {
        const t = msg.data;
        console.log('[live] ② 命中 swap', t);

        /* (1) 交易列表首页:prepend + txHash 去重 */
        queryClient.setQueriesData({ queryKey: tradesFirstPageKey }, (old) => {
          console.log('[live] ③ candlesKey =', candlesKey, '缓存是否存在 =', !!old);
          if (!old?.data) return old;

          if (t.txHash && old.data.some((x) => x.txHash === t.txHash)) {
            return old;
          }

          const nextTrade = {
            trader: t.trader,
            isBuy: t.isBuy,
            amountInRaw: t.amountIn,
            amountOutRaw: t.amountOut,
            priceAfterRaw: t.priceAfter,
            tokensSoldRaw: t.tokensSold,
            timestamp: t.timestamp,
            txHash: t.txHash,
          };

          const merged = [nextTrade, ...old.data];
          const cap = Math.max(old.data.length, TRADE_PAGE_SIZE);
          return { ...old, data: merged.slice(0, cap) };
        });

        /* (2) 代币详情:最新价 / 毕业进度 */
        queryClient.setQueryData(['tokenDetail', address], (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              priceRaw: t.priceAfter,
              tokensSoldRaw: t.tokensSold,
            },
          };
        });

        /* (3) K 线:本地增量聚合,不发请求 */
        queryClient.setQueryData(candlesKey, (old) => {
          if (!old) return old;

          // 兼容两种 cache 形态:直接是数组,还是 { data: [...] }
          const arr = Array.isArray(old) ? old : old.data;
          if (!Array.isArray(arr) || arr.length === 0) return old;

          const next = applyTradeToCandles(arr, t, intervalSec);
          console.log('[live] ④ 聚合结果 changed =', next !== arr, '最后一根 =', arr.at(-1), '→', next.at(-1));
          if (next === arr) return old; // 无需变更

          return Array.isArray(old) ? next : { ...old, data: next };
        });

        return;
      }
      console.log('[live] ② 未命中 swap 分支, type =', msg.type);
      /* ---------- graduated ---------- */
      if (msg.type === 'graduated') {
        queryClient.setQueryData(['tokenDetail', address], (old) => {
          if (!old?.data) return old;
          return { ...old, data: { ...old.data, migrated: true } };
        });
      }
    },
    [address, tradesFirstPageKey, candlesKey, intervalSec, queryClient],
  );

  /* 重连成功 → 补拉首页交易 + 详情,补齐断线期间的缺口 */
  const handleReconnect = useCallback(() => {
    if (!address) return;
    queryClient.invalidateQueries({ queryKey: tradesFirstPageKey });
    queryClient.invalidateQueries({ queryKey: ['tokenDetail', address] });
    // K 线不用管 —— 本地聚合会自然接续,重连后若有空档,下一笔成交会落在新 bucket 里
  }, [address, tradesFirstPageKey, queryClient]);

  const { status } = useWebSocket(
    address ? `/ws/token/${address}` : null,
    handleMessage,
    {
      enabled: enabled && Boolean(address),
      onReconnect: handleReconnect,
    },
  );

  return { status };
}