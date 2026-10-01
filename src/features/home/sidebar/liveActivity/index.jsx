import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import BoltIcon from '@mui/icons-material/Bolt';
import { useGlobalFeed } from '../../../../hooks/useGlobalFeed';
import { useChain } from '../../../../providers/ChainProvider';
import TradeRow from './TradeRow';
import { TRADE_COLORS } from '../../color/tradeColors';
import { useNewestHighlight } from '../../hook/useNewestHighlight';

const MAX_VISIBLE_ITEMS = 30;

function ConnectionDot({ connected }) {
    return (
        <Tooltip title={connected ? '实时连接中' : '连接中断,正在重连'}>
            <Box
                sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: connected ? TRADE_COLORS.buy : 'text.disabled',
                    boxShadow: connected ? `0 0 6px ${TRADE_COLORS.buy}` : 'none',
                }}
            />
        </Tooltip>
    );
}

function CardHeader({ connected }) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <BoltIcon sx={{ fontSize: 18, color: TRADE_COLORS.accent }} />
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>Event</Typography>
            </Box>
            <ConnectionDot connected={connected} />
        </Box>
    );
}

function EmptyState() {
    return (
        <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 13, color: 'text.disabled' }}>暂无数据,正在监听中...</Typography>
        </Box>
    );
}

export default function LiveActivityCard() {
    const { chain } = useChain();
    const { items, status } = useGlobalFeed();
    const newestId = useNewestHighlight(items);

    const visibleItems = items.slice(0, MAX_VISIBLE_ITEMS);

    return (
        <Box
            sx={{
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
            }}
        >
            <CardHeader connected={status === 'open'} />

            <Box sx={{ maxHeight: 650, overflowY: 'auto', p: 1 }}>
                {visibleItems.length === 0 ? (
                    <EmptyState />
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {visibleItems.map((item) => (
                            <TradeRow
                                key={item.id}
                                item={item}
                                isNew={item.id === newestId}
                                explorerTxUrl={chain.explorer.tx}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
}