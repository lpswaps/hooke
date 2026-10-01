import { useState } from 'react';
import Box from '@mui/material/Box';
import { useCandles } from '../../../../hooks/useCandles';
import { KlineChart } from '../tradingview/KlineChart';

// 后端返回的价格 / 成交量都带 18 位精度(wei),在这一层统一换算
const WEI = 1e18;
const CHART_INTERVALS = ['1m', '5m', '1h', '1d'];

// K 线缓存条数:必须和 useTokenLiveFeed 里的 CANDLE_MAX_BARS 一致,否则 queryKey 对不上
const CANDLE_LIMIT = 500;

// '5m' -> 300;区分大小写,'1M'(月)这种解析不了的返回 undefined,图表会跳过补点
const UNIT_SEC = { s: 1, m: 60, h: 3600, d: 86400, w: 604800 };
const intervalToSec = (s) => {
  const m = /^(\d+)([smhdw])$/.exec(String(s));
  return m ? Number(m[1]) * UNIT_SEC[m[2]] : undefined;
};

export default function ChartBox({
  minHeight = 200,
  tokenAddress,
  symbol,
  interval: intervalProp,   // 受控:由父组件传入(推荐,WS 监听要用同一个值)
  onIntervalChange,
}) {
  // 非受控兜底:父组件没传 interval 时才用内部 state
  const [internalInterval, setInternalInterval] = useState(CHART_INTERVALS[1]);
  const isControlled = intervalProp !== undefined;
  const activeInterval = isControlled ? intervalProp : internalInterval;

  const handleSelect = (item) => {
    if (item === activeInterval) return;
    if (!isControlled) setInternalInterval(item);
    onIntervalChange?.(item);
  };

  // 初始数据走 REST;WS 推送由父组件的 useTokenLiveFeed 写入同一个 queryKey,
  // 这里的 data 会自动更新,不需要额外处理
  const { data, isLoading, isError, error } = useCandles(tokenAddress, {
    interval: activeInterval,
    limit: CANDLE_LIMIT,
  });

  console.log(data);


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, bgcolor: '#0e0f0f' }}>
      {/* 工具栏:pump 风格,单行 + 底边框,激活项只变色 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.25,
          px: 1,
          height: 36,
          flexShrink: 0,
          borderColor: 'divider',
        }}
      >
        {CHART_INTERVALS.map((item) => {
          const isActive = item === activeInterval;
          return (
            <Box
              key={item}
              onClick={() => handleSelect(item)}
              sx={{
                cursor: 'pointer',
                px: 1,
                py: 0.5,
                borderRadius: 0.75,
                fontSize: 13,
                fontWeight: 600,
                color: isActive ? 'primary.main' : 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: isActive ? 'primary.main' : 'text.primary',
                },
              }}
            >
              {item}
            </Box>
          );
        })}
      </Box>

      <KlineChart
        data={data?.data}
        loading={isLoading}
        error={isError ? error : null}
        resetKey={`${tokenAddress}-${activeInterval}`}
        title={symbol ? `${symbol} · ${activeInterval}` : activeInterval}
        intervalSec={intervalToSec(activeInterval)}
        minHeight={minHeight}
        priceDivisor={WEI}
        volumeDivisor={WEI}
      />
    </Box>
  );
}