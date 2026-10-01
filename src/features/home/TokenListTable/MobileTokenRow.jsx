import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ChangeText from '../../../components/shared/ChangeText';
import ProgressBar from '../../../components/shared/ProgressBar';
import StatDivider from '../../../components/shared/StatDivider';
import TokenAvatar from '../../../components/shared/TokenAvatar';

// 移动端单条 token 记录：一行紧凑布局
// 左：头像 + 代币名 + 持有人/买卖税/市值（竖线分隔，前两项用图标代替文字标签）+ 发射进度条
// 右：24h 涨跌，用色块突出
export default function MobileTokenRow({ token, onPlaybookClick, isLast }) {
  const isPositive = token.priceChange24h >= 0;

  console.log(token);


  return (
    <Box
      onClick={() => onPlaybookClick(token)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        px: 2,
        py: 1.25,
        borderBottom: isLast ? 'none' : '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
        '&:active': {
          bgcolor: 'action.hover',
        },
      }}
    >

      {/* <TokenAvatar symbol={token.symbol} color={token.avatarColor} size={32} fontSize={13} /> */}

      {/* 中间：代币名 + 持有人/买卖税/市值 + 进度条，minWidth:0 保证文字可省略、不撑破布局 */}
      {/* <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 13.5,
            fontWeight: 700,
            color: 'text.primary',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {token.symbol}
        </Typography>

        <Box sx={{ mt: 0.375 }}>
          <StatDivider
            items={[
              { icon: PersonOutlineOutlinedIcon, text: token.holders.toLocaleString() },
              { text: `${token.buyTax}%/${token.sellTax}%` },
              { text: token.marketCap },
            ]}
          />
        </Box>

        <Box sx={{ mt: 0.75, maxWidth: 140 }}>
          <ProgressBar value={token.progress} width="100%" showLabel={false} />
        </Box>
      </Box> */}

      {/* 右侧：24h 涨跌色块 */}
      {/* <Box sx={{ flexShrink: 0 }}>
        <Box
          sx={{
            px: 1,
            py: 0.375,
            borderRadius: 1,
            bgcolor: isPositive ? 'rgba(143,209,79,0.12)' : 'rgba(241,106,106,0.12)',
          }}
        >
          <ChangeText value={token.change24h} size={13} weight={700} />
        </Box>
      </Box> */}
    </Box>
  );
}
