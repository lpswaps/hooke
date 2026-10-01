import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const PERCENT_SHORTCUTS = [25, 50, 75, 100];

// ⚠️ 仅搭 UI：买/卖切换、输入框、快捷比例、滑点入口、提交按钮
// 具体的下单弹窗 / 交易逻辑由外部接入，这里的 onSubmit 只是占位回调
export default function SwapBox({ symbol = 'TOKEN', onSubmit }) {
  const [side, setSide] = useState('buy'); // 'buy' | 'sell'
  const [amount, setAmount] = useState('');

  const isBuy = side === 'buy';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, height: '100%' }}>
      {/* 买/卖切换 */}
      <Box sx={{ display: 'flex', border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
        {['buy', 'sell'].map((key) => {
          const active = key === side;
          const label = key === 'buy' ? '买入' : '卖出';
          const activeColor = key === 'buy' ? 'success.main' : 'error.main';
          return (
            <Box
              key={key}
              onClick={() => setSide(key)}
              sx={{
                flex: 1,
                textAlign: 'center',
                py: 0.875,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                color: active ? activeColor : 'text.secondary',
                bgcolor: active ? 'rgba(255,255,255,0.04)' : 'transparent',
                transition: 'background-color 0.15s ease',
              }}
            >
              {label}
            </Box>
          );
        })}
      </Box>

      {/* 输入框 */}
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
          <Typography sx={{ fontSize: 11, color: 'text.tertiary' }}>
            {isBuy ? '支付（BNB）' : `支付（${symbol}）`}
          </Typography>
          <Typography sx={{ fontSize: 11, color: 'text.tertiary' }}>余额：0.00</Typography>
        </Box>
        <InputBase
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
          placeholder="0.0"
          sx={{ fontSize: 20, fontWeight: 700, color: 'text.primary', width: '100%' }}
        />
        <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
          {PERCENT_SHORTCUTS.map((p) => (
            <Box
              key={p}
              onClick={() => setAmount(String(p))}
              sx={{
                flex: 1,
                textAlign: 'center',
                py: 0.375,
                borderRadius: 0.75,
                fontSize: 11,
                fontWeight: 600,
                color: 'text.secondary',
                border: '1px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
              }}
            >
              {p === 100 ? 'MAX' : `${p}%`}
            </Box>
          ))}
        </Box>
      </Box>

      {/* 滑点设置入口 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0.25 }}>
        <Typography sx={{ fontSize: 11.5, color: 'text.tertiary' }}>预计获得 {isBuy ? symbol : 'BNB'}：--</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.375, cursor: 'pointer', color: 'text.tertiary', '&:hover': { color: 'text.primary' } }}>
          <SettingsOutlinedIcon sx={{ fontSize: 14 }} />
          <Typography sx={{ fontSize: 11.5 }}>滑点 5%</Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1 }} />

      <Button
        fullWidth
        variant="contained"
        onClick={() => onSubmit?.({ side, amount })}
        sx={{
          height: 42,
          bgcolor: isBuy ? 'success.main' : 'error.main',
          color: '#0A0B08',
          '&:hover': { bgcolor: isBuy ? 'success.main' : 'error.main', opacity: 0.9 },
        }}
      >
        {isBuy ? `买入 ${symbol}` : `卖出 ${symbol}`}
      </Button>
    </Box>
  );
}
