import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../../../styles/theme';
import { HERO_TREND_POINTS } from '../../../../features/home/mock/homeMockData';
import MiniSparkline from '../../MiniSparkline';

// 侧边栏最底部的 Hooke 品牌横幅
// 点击任意位置跳转到「创建代币」页面
export default function CreateTokenBanner() {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate('/create')}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') navigate('/create');
      }}
      sx={{
        bgcolor: 'background.default',
        width: '100%',
        minHeight: 140,
        border: '1px solid',
        borderColor: 'divider',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2.5,
        gap: 1.5,
        transition: 'border-color 0.15s ease',
        '@media (min-width: 1600px)': {
          borderTop: 'none',
        },
      }}
    >
      {/* 背景走势线，弱化透明度作为装饰 */}
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '70%',
          height: '70%',
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      >
        <MiniSparkline
          points={HERO_TREND_POINTS}
          width={200}
          height={90}
          color={colors.accent}
          strokeWidth={1.5}
        />
      </Box>

      {/* 左侧：Logo + 文案 */}
      <Box sx={{ position: 'relative', zIndex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <RocketLaunchIcon sx={{ fontSize: 20, color: 'primary.main' }} />
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: 'text.primary' }}>
            Hooke
          </Typography>
        </Box>
        <Typography
          sx={{
            mt: 0.25,
            fontSize: 13,
            fontWeight: 600,
            color: 'text.secondary',
            whiteSpace: 'nowrap',
          }}
        >
          Build. Launch. Grow.
        </Typography>
      </Box>

      {/* 右侧：跳转箭头按钮 */}
      <IconButton
        size="small"
        sx={{
          position: 'relative',
          zIndex: 1,
          flexShrink: 0,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': {
            bgcolor: 'primary.main',
            boxShadow: `0 0 16px ${colors.accentDim}`,
          },
        }}
      >
        <ArrowForwardIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
