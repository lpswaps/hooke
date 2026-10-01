import { memo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import { getActionColor, TRADE_COLORS } from '../../color/tradeColors';
import { toTradeViewModel } from '../../utils/tradeUtils';

function DirectionIcon({ isBuy, color }) {
    const Icon = isBuy ? NorthEastIcon : SouthEastIcon;
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                flexShrink: 0,
                borderRadius: '50%',
                color,
                bgcolor: alpha(color, 0.12),
            }}
        >
            <Icon sx={{ fontSize: 16 }} />
        </Box>
    );
}

function ExplorerLink({ href }) {
    return (
        <Tooltip title="查看链上交易">
            <Box
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 26,
                    height: 26,
                    flexShrink: 0,
                    borderRadius: 1,
                    color: 'text.disabled',
                    '&:hover': { color: TRADE_COLORS.accent, bgcolor: 'action.hover' },
                }}
            >
                <OpenInNewIcon sx={{ fontSize: 15 }} />
            </Box>
        </Tooltip>
    );
}

function TradeRow({ item, isNew, explorerTxUrl }) {
    const { isBuy, trader, token, amount, symbol, time, txHash } = toTradeViewModel(item);
    const color = getActionColor(isBuy);

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                px: 1.5,
                py: 1,
                borderLeft: `3px solid ${color}`,
                borderRadius: 1,
                bgcolor: isNew ? alpha(color, 0.13) : 'transparent',
                transition: 'background-color 1.8s ease-out',
                '&:hover': { bgcolor: 'action.hover' },
            }}
        >
            <DirectionIcon isBuy={isBuy} color={color} />

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, flexWrap: 'wrap' }}>
                    <Typography component="span" sx={{ fontSize: 13, color: 'text.secondary' }}>
                        {trader}
                    </Typography>
                    <Typography component="span" sx={{ fontSize: 13, fontWeight: 600, color }}>
                        {isBuy ? '买入' : '卖出'}
                    </Typography>
                    <Typography component="span" sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>
                        {token}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                    <Typography component="span" sx={{ fontSize: 15, fontWeight: 700, color: 'text.primary' }}>
                        {amount} {symbol}
                    </Typography>
                    <Typography component="span" sx={{ fontSize: 12, color: 'text.disabled' }}>
                        · {time}
                    </Typography>
                </Box>
            </Box>

            <ExplorerLink href={`${explorerTxUrl}${txHash}`} />
        </Box>
    );
}

// 传入的是字符串 explorerTxUrl 而不是 chain 对象,memo 才能真正生效
export default memo(TradeRow);