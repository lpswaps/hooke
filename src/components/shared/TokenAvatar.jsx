import Avatar from '@mui/material/Avatar';

// 代币头像：统一用"圆角方形"而不是圆形，配合整站"整齐方正"的视觉风格
// size 传数字（px），desktop 表格用 28，移动端卡片用 32
export default function TokenAvatar({ symbol, color, size = 28, fontSize = 12 }) {
  return (
    <Avatar
      variant="rounded"
      sx={{
        width: size,
        height: size,
        fontSize,
        fontWeight: 700,
        bgcolor: color,
        color: '#0A0B08',
        flexShrink: 0,
        borderRadius: 1, // 与站内卡片/按钮的圆角保持一致
      }}
    >
      {symbol?.slice(0, 1)}
    </Avatar>
  );
}
