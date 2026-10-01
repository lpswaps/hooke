import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// 一组用竖线分隔的小字段，例如 " 2,481 | 5%/5% | $3.12M"
// 竖线用一个小方块画（而不是打一个 "|" 字符），高度、位置都能精确对齐，
// 比字符竖线更整齐
//
// items 里每一项是 { icon?: 图标组件, text: 文字 }
// icon 可选——有的字段（比如持有人数、买卖税）用图标代替文字标签更省地方，
// 有的字段（比如市值，本身就是 "$3.12M" 这种带英文缩写的格式）不需要图标
export default function StatDivider({ items }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
      {items.map(({ icon: Icon, text }, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
          {index > 0 && (
            <Box sx={{ width: '1px', height: 10, bgcolor: 'divider', flexShrink: 0 }} />
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.375, minWidth: 0 }}>
            {Icon && <Icon sx={{ fontSize: 12, color: 'text.secondary', flexShrink: 0 }} />}
            <Typography
              sx={{
                fontSize: 11.5,
                fontWeight: 600,
                color: 'text.secondary',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {text}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
