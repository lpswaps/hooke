/** 统一转成 UTC 秒。兼容:秒 / 毫秒 数字、数字字符串、ISO 字符串 */
export function normalizeToSeconds(t) {
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

/** 转 BigInt(wei 整数)。失败返回 null */
function toBig(v) {
    try {
        if (v == null) return null;
        if (typeof v === 'bigint') return v;
        if (typeof v === 'number') return Number.isFinite(v) ? BigInt(Math.trunc(v)) : null;
        const s = String(v).trim();
        if (/^\d+$/.test(s)) return BigInt(s);
        if (/^\d+\.\d+$/.test(s)) return BigInt(s.split('.')[0]); // 带小数的截断
        return null;
    } catch {
        return null;
    }
}

/** 这笔成交对 K 线 volume 的贡献(买入取 amountIn,卖出取 amountOut) */
function tradeVolume(trade) {
    return toBig(trade.isBuy ? trade.amountIn : trade.amountOut) ?? 0n;
}

/** 按缓存里已有字段的类型输出:字符串就输出字符串,数字就输出数字 */
function fmtLike(sample, big) {
    return typeof sample === 'number' ? Number(big) : big.toString();
}

/** 按最后一根 time 的格式,把 bucket 秒还原成同样的格式 */
function fmtTimeLike(sample, bucketSec) {
    if (typeof sample === 'string' && !/^\d+(\.\d+)?$/.test(sample)) {
        return new Date(bucketSec * 1000).toISOString();   // ISO 字符串
    }
    if (typeof sample === 'number' && sample > 1e11) return bucketSec * 1000; // 毫秒
    if (typeof sample === 'string') return String(bucketSec);
    return bucketSec; // 秒
}

export function applyTradeToCandles(candles, trade, intervalSec, maxBars = 500) {
    if (!candles?.length) return candles;
    if (!Number.isFinite(intervalSec) || intervalSec <= 0) return candles;

    const tradeSec = normalizeToSeconds(trade.timestamp);
    const price = toBig(trade.priceAfter);
    if (!Number.isFinite(tradeSec) || price == null) {
        console.warn('[candle] 忽略成交:字段解析失败', { tradeSec, price, trade });
        return candles;
    }

    const last = candles[candles.length - 1];
    const lastSec = normalizeToSeconds(last.time);
    if (!Number.isFinite(lastSec)) {
        console.warn('[candle] 忽略成交:last.time 无法解析', last);
        return candles;
    }

    const bucket = Math.floor(tradeSec / intervalSec) * intervalSec;
    const deltaVol = tradeVolume(trade);

    /* ① 落在当前这根:更新 H / L / C / V / tradeCount(open 不动) */
    if (bucket === lastSec) {
        const high = toBig(last.high);
        const low = toBig(last.low);
        const vol = toBig(last.volume) ?? 0n;

        const updated = {
            ...last,
            high: fmtLike(last.high, high != null && high > price ? high : price),
            low: fmtLike(last.low, low != null && low < price ? low : price),
            close: fmtLike(last.close, price),
            volume: fmtLike(last.volume, vol + deltaVol),
            tradeCount: (Number(last.tradeCount) || 0) + 1,
        };
        return [...candles.slice(0, -1), updated];
    }

    /* ② 跨到新周期:新建一根,open = 上一根 close */
    if (bucket > lastSec) {
        const open = toBig(last.close) ?? price;
        const high = open > price ? open : price;
        const low = open < price ? open : price;

        const next = {
            time: fmtTimeLike(last.time, bucket),
            open: fmtLike(last.open, open),
            high: fmtLike(last.high, high),
            low: fmtLike(last.low, low),
            close: fmtLike(last.close, price),
            volume: fmtLike(last.volume, deltaVol),
            tradeCount: 1,
        };
        return [...candles, next].slice(-maxBars);
    }

    /* ③ bucket < lastSec:真正比最后一根旧(乱序 / 重连补发),忽略 */
    console.warn('[candle] 忽略成交:比最后一根旧', { bucket, lastSec, trade });
    return candles;
}