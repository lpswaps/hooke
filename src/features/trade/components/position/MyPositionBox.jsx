import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ChangeText from '../../../../components/shared/ChangeText';
import ConnectWalletButton from '../../../../components/layout/ConnectWalletButton';
import { MY_POSITION } from '../.././mock/tradeMockData';

// ⚠️ 这块位置图里还没想好放什么，先用「我的仓位」占位：
// 展示当前用户在这个代币里的持仓、成本、盈亏，方便快速加/减仓。
// 其它备选：代币安全检测详情 / 价格提醒设置 / 相关代币推荐 / 评论区
// 想换内容的话直接换这个组件即可，外层网格布局不需要动
export default function MyPositionBox({ symbol = 'TOKEN' }) {
  const { connected, amount, avgCost, costUsd, currentValue, pnlPercent } = MY_POSITION;

  if (!connected) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.25, height: '100%' }}>
        <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>连接钱包查看你的持仓</Typography>
        <ConnectWalletButton />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, height: '100%' }}>
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary' }}>我的仓位</Typography>

      <Box>
        <Typography sx={{ fontSize: 11, color: 'text.tertiary' }}>持有数量</Typography>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: 'text.primary' }}>
          {amount} {symbol}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box>
          <Typography sx={{ fontSize: 11, color: 'text.tertiary' }}>成本</Typography>
          <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>{avgCost}</Typography>
          <Typography sx={{ fontSize: 11, color: 'text.tertiary' }}>{costUsd}</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 11, color: 'text.tertiary' }}>当前价值</Typography>
          <Typography sx={{ fontSize: 12.5, color: 'text.primary' }}>{currentValue}</Typography>
          <ChangeText value={pnlPercent} size={11} weight={700} />
        </Box>
      </Box>

      <Box sx={{ flex: 1 }} />

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button fullWidth variant="outlined" sx={{ height: 32, fontSize: 12.5, color: 'success.main', borderColor: 'divider' }}>
          加仓
        </Button>
        <Button fullWidth variant="outlined" sx={{ height: 32, fontSize: 12.5, color: 'error.main', borderColor: 'divider' }}>
          减仓
        </Button>
      </Box>
    </Box>
  );
}
