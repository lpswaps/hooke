import { useState } from 'react';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import TopInfoBar from '../features/trade/components/info/TopInfoBar';
import ChartBox from '../features/trade/components/chart/ChartBox';
import SwapBox from '../features/trade/components/swap/SwapBox';
import HookInfoBox from '../features/trade/components/hook/HookInfoBox';
import ActivityBox from '../features/trade/components/activity/ActivityBox';
import HoldingsBox from '../features/trade/components/holdings/HoldingsBox';
import MyPositionBox from '../features/trade/components/position/MyPositionBox';
import MobileActivitySwitcher from '../features/trade/components/mobile/MobileActivitySwitcher';
import { TOKEN_DETAIL } from '../features/trade/mock/tradeMockData';
import { useTokenLiveFeed } from '../features/trade/hooks/useTokenLiveFeed';

// 交易详情页尺寸常量
export const CONTENT_WIDTH = 1400;
export const SIDE_PANEL_WIDTH = 360;
export const SIDE_PANEL_WIDTH_NARROW = 300;

// 图表默认周期:必须是 ChartBox 里 CHART_INTERVALS 中的一项
const DEFAULT_CHART_INTERVAL = '5m';

/**
 * 单元格:不再是卡片,只负责 padding 和防止内容撑破 grid。
 * 分割线由父级通过 borderTop / borderLeft 等控制。
 */
function Cell({ children, sx, ...rest }) {
    return (
        <Box sx={{ minWidth: 0, boxSizing: 'border-box', ...sx }} {...rest}>
            {children}
        </Box>
    );
}

/** 桌面端布局(≥900px):一个大框 + 内部分割线 */
function DesktopLayout({ tokenAddress, chartInterval, onChartIntervalChange }) {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) var(--side) var(--side)',
                gridTemplateRows: 'auto minmax(0, 1fr) auto',
                gridTemplateAreas: `
                    "info     info     side"
                    "chart    chart    side"
                    "activity holdings position"
                `,
                '--side': `${SIDE_PANEL_WIDTH}px`,
                '@media (max-width: 1150px)': {
                    '--side': `${SIDE_PANEL_WIDTH_NARROW}px`,
                },
            }}
        >
            {/* 顶部信息栏 */}
            <Cell sx={{ gridArea: 'info', p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <TopInfoBar tokenAddress={tokenAddress} />
            </Cell>

            {/* K 线图 */}
            <Cell sx={{ gridArea: 'chart', p: 1, minHeight: 280, display: 'flex', flexDirection: 'column' }}>
                <ChartBox
                    tokenAddress={tokenAddress}
                    minHeight={280}
                    interval={chartInterval}
                    onIntervalChange={onChartIntervalChange}
                />
            </Cell>

            {/* 右侧:Swap + Hook,跨上面两行 */}
            <Cell
                sx={{
                    gridArea: 'side',
                    borderLeft: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                    <SwapBox symbol={TOKEN_DETAIL.symbol} />
                </Box>
                <Box sx={{ p: 1.5, flex: 1 }}>
                    <HookInfoBox />
                </Box>
            </Cell>

            {/* 下半部分:三栏,用 borderTop / borderLeft 分割 */}
            <Cell sx={{ gridArea: 'activity', p: 2, minHeight: 600, borderTop: 1, borderColor: 'divider' }}>
                <ActivityBox variant="desktop" />
            </Cell>

            <Cell
                sx={{
                    gridArea: 'holdings',
                    p: 2,
                    minHeight: 420,
                    borderTop: 1,
                    borderLeft: 1,
                    borderColor: 'divider',
                }}
            >
                <HoldingsBox variant="desktop" />
            </Cell>
            <Cell
                sx={{
                    gridArea: 'position',
                    p: 2,
                    minHeight: 420,
                    borderTop: 1,
                    borderLeft: 1,
                    borderColor: 'divider',
                }}
            >
                <MyPositionBox symbol={TOKEN_DETAIL.symbol} />
            </Cell>
        </Box>
    );
}

/** 移动端布局(<900px):纵向堆叠,横线分割 */
function MobileLayout({ tokenAddress, chartInterval, onChartIntervalChange }) {
    const rowSx = { borderBottom: 1, borderColor: 'divider' };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Cell sx={{ ...rowSx, p: 1.5 }}>
                <TopInfoBar tokenAddress={tokenAddress} token={TOKEN_DETAIL} />
            </Cell>

            <Cell sx={{ ...rowSx, p: 0.5, minHeight: 300 }}>
                <ChartBox
                    tokenAddress={tokenAddress}
                    minHeight={260}
                    interval={chartInterval}
                    onIntervalChange={onChartIntervalChange}
                />
            </Cell>

            {/* 最后一块不需要底部线 */}
            <Cell sx={{ p: 1.5, minHeight: 400 }}>
                <MobileActivitySwitcher />
            </Cell>
        </Box>
    );
}

export default function TradePage() {
    const params = useParams();
    // 统一小写:避免 checksummed / lowercase 混用导致 queryKey 匹配不上、WS 订阅失败
    const tokenAddress = params.address?.toLowerCase();
    const theme = useTheme();

    // 图表周期由页面持有:WS 监听和图表必须用同一个 interval,
    // 否则推送写的是 A 周期的缓存,图表读的是 B 周期的缓存
    const [chartInterval, setChartInterval] = useState(DEFAULT_CHART_INTERVAL);

    // WS 监听:只负责把推送写进 react-query 缓存,不返回数据
    useTokenLiveFeed(tokenAddress, { interval: chartInterval });

    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const layoutProps = {
        tokenAddress,
        chartInterval,
        onChartIntervalChange: setChartInterval,
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Box
                sx={{
                    width: CONTENT_WIDTH,
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    px: { xs: 0, md: 2 },
                    py: { xs: 0, md: 2 },
                }}
            >
                {/* 唯一的外框 */}
                <Box
                    sx={{
                        borderStyle: 'solid',
                        borderWidth: { xs: 0, md: 1 },   // 只响应式改宽度
                        borderColor: 'divider',          // 想改颜色就改这里
                        borderRadius: { xs: 0, md: 1 },
                        overflow: 'clip',
                        bgcolor: 'background.default',
                    }}
                >
                    {isDesktop ? (
                        <DesktopLayout {...layoutProps} />
                    ) : (
                        <MobileLayout {...layoutProps} />
                    )}
                </Box>
            </Box>
        </Box>
    );
}