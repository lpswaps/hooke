import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// 通用"标签盒子"：一个带边框/底色的小方块，用来突出显示列表里的某个参数
// （比如买卖税、hook 类型……），列表其它地方要用同样的样式就直接复用这个组件，
// 不用每次都手写一遍 Box + sx
//
// tone 决定配色，不用记具体颜色值：
//   neutral -> 灰色描边，默认用来放不需要强调的参数
//   accent  -> 主题色（荧光青柠绿），强调"正向/推荐"的参数
//   warning -> 琥珀色，适合税率这类"需要注意"的参数
//   danger  -> 红色，适合风险/负向参数
const TONE_STYLES = {
  neutral: { border: 'divider', color: 'text.secondary', bg: 'transparent' },
  accent: { border: 'primary.main', color: 'primary.main', bg: 'rgba(199,248,76,0.08)' },
  warning: { border: '#F2C94C', color: '#F2C94C', bg: 'rgba(242,201,76,0.08)' },
  danger: { border: 'error.main', color: 'error.main', bg: 'rgba(241,106,106,0.08)' },
};

export default function TagBox({
  label,
  icon: Icon,
  tone = 'neutral',
  size = 'small', // 'small' | 'medium'
  sx,
}) {
  const style = TONE_STYLES[tone] ?? TONE_STYLES.neutral;
  const isSmall = size === 'small';

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.375,
        height: isSmall ? 18 : 22,
        px: isSmall ? 0.75 : 1,
        borderRadius: 1,
        border: '1px solid',
        borderColor: style.border,
        bgcolor: style.bg,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...sx,
      }}
    >
      {Icon && <Icon sx={{ fontSize: isSmall ? 11 : 13, color: style.color }} />}
      <Typography
        sx={{
          fontSize: isSmall ? 10 : 11,
          fontWeight: 700,
          color: style.color,
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
