import { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';
import {
    createChart,
    CandlestickSeries,
    HistogramSeries,
    ColorType,
    CrosshairMode,
    LineStyle,
    TickMarkType,
} from 'lightweight-charts';

/* ----------------------------- 数据处理 ----------------------------- */

const MAX_VALUE = 90071992547409;

// [改] 类 pump 的视图:一屏约 60 根,最后一根在 70% 处
const VISIBLE_BARS = 60;
const LAST_BAR_POS = 0.7;
const RIGHT_BARS = Math.round(VISIBLE_BARS * (1 - LAST_BAR_POS)); // 右侧留白 18 根
const LEFT_BARS = VISIBLE_BARS - RIGHT_BARS;                       // 左侧 42 根

function toSeconds(t) {
    if (t == null) return NaN;
    if (typeof t === 'number' || /^\d+(\.\d+)?$/.test(String(t))) {
        const n = Number(t);
        return n > 1e11 ? Math.floor(n / 1000) : Math.floor(n);
    }
    const ms = Date.parse(t);
    return Number.isFinite(ms) ? Math.floor(ms / 1000) : NaN;
}


export function normalizeCandles(raw, priceDivisor = 1, volumeDivisor = 1) {
    if (!Array.isArray(raw)) return [];
    const map = new Map();
    for (const item of raw) {
        const time = toSeconds(item.time ?? item.t ?? item.timestamp);
        const open = Number(item.open ?? item.o) / priceDivisor;
        const high = Number(item.high ?? item.h) / priceDivisor;
        const low = Number(item.low ?? item.l) / priceDivisor;
        const close = Number(item.close ?? item.c) / priceDivisor;
        let volume = Number(item.volume ?? item.v ?? 0) / volumeDivisor;

        if (![time, open, high, low, close].every(Number.isFinite)) continue;
        if ([open, high, low, close].some((v) => Math.abs(v) >= MAX_VALUE)) continue;
        if (!Number.isFinite(volume) || Math.abs(volume) >= MAX_VALUE) volume = 0;

        map.set(time, { time, open, high, low, close, volume });
    }
    return [...map.values()].sort((a, b) => a.time - b.time);
}

/** [新] 给 K 线前后补「空白点」(只有 time),让左右两侧也有时间刻度 */
function buildCandleSeries(candles, step) {
    const ohlc = candles.map(({ time, open, high, low, close }) => ({ time, open, high, low, close }));
    if (!step || candles.length === 0) return { data: ohlc, lastIndex: ohlc.length - 1 };

    const first = candles[0].time;
    const last = candles[candles.length - 1].time;
    const left = Array.from({ length: LEFT_BARS }, (_, i) => ({ time: first - (LEFT_BARS - i) * step }));
    const right = Array.from({ length: RIGHT_BARS }, (_, i) => ({ time: last + (i + 1) * step }));
    return {
        data: [...left, ...ohlc, ...right],
        lastIndex: left.length + ohlc.length - 1,
    };
}

/* ----- 价格格式化 ----- */
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const toSub = (n) => String(n).split('').map((d) => SUB[d]).join('');
const trimZeros = (s) => (s.includes('.') ? s.replace(/\.?0+$/, '') : s);
const BIG_UNITS = [[1e12, 'T'], [1e9, 'B'], [1e6, 'M'], [1e3, 'K']];

export function formatPrice(v, sig = 4) {
    if (!Number.isFinite(v)) return '--';
    if (v === 0) return '0';
    const sign = v < 0 ? '-' : '';
    const a = Math.abs(v);

    for (const [base, unit] of BIG_UNITS) {
        if (a >= base) return sign + trimZeros((a / base).toFixed(2)) + unit;
    }
    if (a >= 1) return sign + trimZeros(a.toFixed(a >= 100 ? 2 : 4));

    const [mantissa, exp] = a.toExponential(sig - 1).split('e');
    const zeros = -Number(exp) - 1;
    // [改] 有效数字不再去尾 0:否则 1.0e-11 和 1.5e-11 会显示成 0.0₁₀1 / 0.0₁₀15,坐标轴上很难读
    const digits = mantissa.replace('.', '');
    if (zeros < 4) return `${sign}0.${'0'.repeat(zeros)}${digits}`;
    return `${sign}0.0${toSub(zeros)}${digits}`;
}

function getPriceFormat(candles) {
    const last = candles[candles.length - 1]?.close;
    let precision = 6;
    if (Number.isFinite(last) && last > 0) {
        if (last >= 1000) precision = 2;
        else if (last >= 1) precision = 4;
        else precision = Math.min(Math.floor(-Math.log10(last)) + 4, 18);
    }
    return { type: 'custom', formatter: (p) => formatPrice(p), minMove: Math.pow(10, -precision) };
}

const pad = (n) => String(n).padStart(2, '0');

const formatTick = (time, type) => {
    const d = new Date(time * 1000);
    switch (type) {
        case TickMarkType.Year:
            return String(d.getFullYear());
        case TickMarkType.Month:
            return `${d.getMonth() + 1}月`;
        case TickMarkType.DayOfMonth:
            return `${d.getMonth() + 1}/${pad(d.getDate())}`;
        default:
            return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
};

const formatCrosshairTime = (time) => {
    const d = new Date(time * 1000);
    return `${d.getMonth() + 1}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const compactFmt = new Intl.NumberFormat('en', { notation: 'compact', maximumSignificantDigits: 3 });

/* ----------------------------- 主题颜色 ----------------------------- */

function useChartColors() {
    const theme = useTheme();
    return useMemo(() => {
        const p = theme.palette;
        const up = p.success?.main ?? '#4ADE80';
        const down = p.error?.main ?? '#F6465D';
        const primary = p.primary?.main ?? '#EAC62F';
        return {
            up,
            down,
            primary,
            volUp: alpha(up, 0.35),
            volDown: alpha(down, 0.35),
            text: p.text?.secondary ?? '#9a9a9a',
            grid: p.divider ?? 'rgba(255,255,255,0.08)',
            crosshair: alpha(primary, 0.6),
            font: theme.typography?.fontFamily,
        };
    }, [theme]);
}

/* ----------------------------- 组件 ----------------------------- */

function Stat({ label, value, color }) {
    return (
        <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
            {label && <Box component="span" sx={{ color: 'text.secondary', mr: 0.5 }}>{label}</Box>}
            <Box component="span" sx={{ color: color ?? 'text.primary', fontWeight: 600 }}>{value}</Box>
        </Box>
    );
}

/**
 * @param {string} title        [新] 图例第一行的标题,如 "WTM · 5m"
 * @param {number} intervalSec  [新] 当前周期的秒数,用于补平盘 K 线和左右空白刻度
 */
export function KlineChart({
    data,
    loading = false,
    error = null,
    showVolume = true,
    resetKey = '',
    title = '',
    intervalSec,
    minHeight = 420,
    priceDivisor = 1,
    volumeDivisor = 1,
}) {
    const colors = useChartColors();
    const containerRef = useRef(null);
    const apiRef = useRef({});
    const lastAppliedRef = useRef(null); // { resetKey, lastTime }
    const [hover, setHover] = useState(null);

    const candles = useMemo(
        () => normalizeCandles(data, priceDivisor, volumeDivisor),
        [data, priceDivisor, volumeDivisor, intervalSec],
    );
    // [改] 删掉了原来行尾多出来的 `getPriceFormat` 游离表达式
    const priceFormat = useMemo(() => getPriceFormat(candles), [candles]);
    const candleSeries = useMemo(() => buildCandleSeries(candles, intervalSec), [candles, intervalSec]);

    // 1) 创建 / 销毁图表
    useEffect(() => {
        const chart = createChart(containerRef.current, {
            autoSize: true,
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                attributionLogo: false,
            },
        });
        const candle = chart.addSeries(CandlestickSeries, { borderVisible: false });
        const volume = chart.addSeries(HistogramSeries, {
            priceFormat: { type: 'volume' },
            priceScaleId: '',
            lastValueVisible: false,
            priceLineVisible: false,
        });
        volume.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });

        const onMove = (param) => {
            const d = param.seriesData.get(candle);
            if (!param.time || !d || d.open == null) return setHover(null); // 空白点没有 OHLC
            setHover({ ...d, volume: param.seriesData.get(volume)?.value });
        };
        chart.subscribeCrosshairMove(onMove);

        apiRef.current = { chart, candle, volume };
        lastAppliedRef.current = null;

        return () => {
            chart.unsubscribeCrosshairMove(onMove);
            chart.remove();
            apiRef.current = {};
        };
    }, []);

    // 2) 主题 / 显示选项
    useEffect(() => {
        const { chart, candle, volume } = apiRef.current;
        if (!chart) return;
        chart.applyOptions({
            layout: { textColor: colors.text, fontFamily: colors.font, fontSize: 11 },
            grid: {
                vertLines: { visible: false },             // [改] 去掉竖线,像 pump 一样干净
                horzLines: { color: colors.grid },
            },
            crosshair: {
                mode: CrosshairMode.Normal,
                vertLine: { color: colors.crosshair, labelBackgroundColor: colors.primary, style: LineStyle.Dashed }, // [改] 虚线
                horzLine: { color: colors.crosshair, labelBackgroundColor: colors.primary, style: LineStyle.Dashed },
            },
            rightPriceScale: {
                borderVisible: false,
                // [改] 顶部多留一点,给两行图例让位
                scaleMargins: { top: showVolume ? 0.18 : 0.12, bottom: showVolume ? 0.25 : 0.08 },
            },
            timeScale: {
                borderVisible: false,
                timeVisible: true,
                secondsVisible: false,
                // [改] 去掉 rightOffset: 6,可见范围由下面的 setVisibleLogicalRange 决定
                tickMarkFormatter: formatTick,
            },
            localization: { timeFormatter: formatCrosshairTime },
        });
        candle.applyOptions({
            upColor: colors.up,
            downColor: colors.down,
            wickUpColor: colors.up,
            wickDownColor: colors.down,
        });
        volume.applyOptions({ visible: showVolume });
    }, [colors, showVolume]);

    // 3) 灌入数据
    useEffect(() => {
        const { chart, candle, volume } = apiRef.current;
        if (!chart) return;

        const last = candles[candles.length - 1];
        const prev = lastAppliedRef.current;

        // 增量更新:同一根 K 线被 WS 更新时,只重画最后一根
        const canIncremental =
            prev != null &&
            prev.resetKey === resetKey &&
            last != null &&
            prev.lastTime != null &&
            last.time === prev.lastTime;

        if (canIncremental) {
            candle.update({
                time: last.time,
                open: last.open,
                high: last.high,
                low: last.low,
                close: last.close,
            });
            volume.update({
                time: last.time,
                value: last.volume,
                color: last.close >= last.open ? colors.volUp : colors.volDown,
            });
            return;
        }

        // 全量:首次 / 切币 / 切周期 / 跨周期
        candle.applyOptions({ priceFormat });
        candle.setData(candleSeries.data);
        volume.setData(
            candles.map((c) => ({
                time: c.time,
                value: c.volume,
                color: c.close >= c.open ? colors.volUp : colors.volDown,
            })),
        );

        if (candles.length > 0) {
            const lastIdx = candleSeries.lastIndex;
            chart.timeScale().setVisibleLogicalRange({
                from: lastIdx - LEFT_BARS,
                to: lastIdx + RIGHT_BARS,
            });
        }

        lastAppliedRef.current = {
            resetKey,
            lastTime: last?.time ?? null,
        };
    }, [candles, candleSeries, priceFormat, colors, resetKey]);

    // 图例
    const current = hover ?? candles[candles.length - 1];
    const change = current && current.open ? ((current.close - current.open) / current.open) * 100 : 0;
    const trendColor = change >= 0 ? colors.up : colors.down;
    const fmt = (v) => formatPrice(v); // [改] 原来用 priceFormat.precision(不存在),所以全是 0

    return (
        <Box sx={{ position: 'relative', flex: 1, minHeight, width: '100%' }}>
            {current && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 6,
                        left: 8,
                        zIndex: 2,
                        fontSize: 12,
                        lineHeight: 1.7,
                        pointerEvents: 'none',
                    }}
                >
                    {/* 第一行:标题 + OHLC + 涨跌幅 */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 1.5 }}>
                        {title && (
                            <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>{title}</Box>
                        )}
                        <Stat label="O" value={fmt(current.open)} color={trendColor} />
                        <Stat label="H" value={fmt(current.high)} color={trendColor} />
                        <Stat label="L" value={fmt(current.low)} color={trendColor} />
                        <Stat label="C" value={fmt(current.close)} color={trendColor} />
                        <Stat value={`${change >= 0 ? '+' : ''}${change.toFixed(2)}%`} color={trendColor} />
                    </Box>
                    {/* 第二行:成交量 */}
                    {showVolume && Number.isFinite(current.volume) && (
                        <Box>
                            <Stat label="Volume" value={compactFmt.format(current.volume)} color={trendColor} />
                        </Box>
                    )}
                </Box>
            )}

            <Box ref={containerRef} sx={{ position: 'absolute', inset: 0 }} />

            {(loading || error || (!loading && candles.length === 0)) && (
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: loading && candles.length > 0 ? alpha('#000', 0.35) : 'transparent',
                        pointerEvents: loading ? 'auto' : 'none',
                    }}
                >
                    {loading ? (
                        <CircularProgress size={24} color="primary" />
                    ) : (
                        <Typography variant="body2" sx={{ color: error ? 'error.main' : 'text.secondary' }}>
                            {error ? `K 线加载失败${error?.message ? `:${error.message}` : ''}` : '暂无 K 线数据'}
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
}