import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../styles/theme';
import TrendArrow from './pub/TrendArrow';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import TagBox from '../../components/shared/TagBox';

const FEATURES = [
  { label: '灵活毕业门槛', icon: TuneOutlinedIcon },
  { label: '内盘博弈机制', icon: SwapHorizOutlinedIcon },
  { label: '开放 Hook 生态', icon: ExtensionOutlinedIcon },
];

export default function HeroBanner() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: { xs: 0, sm: 190 },   // 小屏不强行撑高
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default',

        // 小屏内边距更紧凑
        px: { xs: 2.5, sm: 4, md: 5 },
        py: { xs: 2, sm: 3 },

        display: 'flex',
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },

        // ============ 背景层 ============
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px),
          radial-gradient(ellipse 60% 90% at 88% 12%, ${colors.accentDim} 0%, transparent 60%),
          radial-gradient(ellipse 45% 80% at 8% 100%, ${colors.accentDim} 0%, transparent 65%)
        `,
        backgroundSize: `
          34px 34px,
          34px 34px,
          100% 100%,
          100% 100%
        `,
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 75% 120% at 50% 0%, transparent 40%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
    >
      {/* ============ 折线箭头：仅桌面端 ============ */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          opacity: 0.95,
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <TrendArrow color={colors.accent} duration={4} />
      </Box>

      {/* ================= 左侧文案 ================= */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          minWidth: 0,
          maxWidth: 620,
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        {/* 主标题：小屏 22px */}
        <Typography
          variant="h3"
          sx={{
            color: 'text.primary',
            lineHeight: 1.25,
            fontSize: { xs: 22, sm: 32, md: 36 },
          }}
        >
          玩转内盘，
          <br />
          <Box component="span" sx={{ color: 'primary.main' }}>
            而不只是冲出去
          </Box>
        </Typography>

        {/* 副标题（主）：小屏 13px */}
        <Typography
          sx={{
            mt: { xs: 1.5, sm: 2 },
            color: 'text.secondary',
            fontWeight: 600,
            fontSize: { xs: 13, sm: 15 },
            lineHeight: 1.5,
          }}
        >
          更大的毕业门槛，接入任意生态的开放式启动平台
        </Typography>

        {/* 副标题（次）：小屏 11.5px */}
        <Typography
          sx={{
            mt: { xs: 0.5, sm: 0.5 },
            color: 'text.secondary',
            opacity: 0.8,
            fontSize: { xs: 11.5, sm: 13 },
            lineHeight: 1.5,
          }}
        >
          可编程 Hook,让代币在启动阶段接入您的任意生态系统
        </Typography>

        {/* ================= 特性标签：小屏缩小 ================= */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 0.5, sm: 0.75 },
            mt: { xs: 1.5, sm: 2 },
          }}
        >
          {FEATURES.map((f) => (
            <TagBox
              key={f.label}
              label={f.label}
              icon={f.icon}
              tone="accent"
              size="small"       // 小屏/桌面都用 small，更紧凑
            />
          ))}
        </Box>
      </Box>

      {/* ================= 按钮：仅桌面端 ================= */}
      <Button
        variant="contained"
        color="primary"
        endIcon={<ArrowForwardIcon />}
        onClick={() => navigate('/create')}
        sx={{
          px: 3,
          py: 1,
          fontWeight: 700,
          flexShrink: 0,
          boxShadow: `0 0 0 1px ${colors.accent}33, 0 8px 24px -6px ${colors.accent}66`,
          '&:hover': {
            boxShadow: `0 0 0 1px ${colors.accent}55, 0 10px 28px -6px ${colors.accent}88`,
          },
          display: { xs: 'none', sm: 'inline-flex' },
          position: 'absolute',
          right: { sm: 32, md: 40 },
          bottom: { sm: 24, md: 28 },
          zIndex: 3,
        }}
      >
        创建 Token
      </Button>
    </Box>
  );
}