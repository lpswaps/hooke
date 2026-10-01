import Typography from '@mui/material/Typography';

// 涨跌幅文字：正数用 success 色，负数用 error 色，统一在整个站点复用
// （代币列表桌面表格 / 移动端卡片都用它，避免各处各写一份判断逻辑）
export default function ChangeText({ value, size = 13, weight = 600 }) {
  const isPositive = value >= 0;
  return (
    <Typography
      sx={{
        fontSize: size,
        fontWeight: weight,
        color: isPositive ? 'success.main' : 'error.main',
        whiteSpace: 'nowrap',
      }}
    >
      {isPositive ? '+' : ''}
      {value}%
    </Typography>
  );
}
