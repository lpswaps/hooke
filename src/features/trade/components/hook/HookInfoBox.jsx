import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import ElectricBoltOutlinedIcon from '@mui/icons-material/ElectricBoltOutlined';
import { HOOK_INFO } from '../.././mock/tradeMockData';

// 用户代币实现的 hook 机制介绍 + 跳转到详情文档
export default function HookInfoBox() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <ElectricBoltOutlinedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary' }}>
          {HOOK_INFO.title}
        </Typography>
      </Box>

      <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.6, flex: 1 }}>
        {HOOK_INFO.description}
      </Typography>

      <Box
        component="a"
        href={HOOK_INFO.linkUrl}
        target="_blank"
        rel="noreferrer"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          fontSize: 12,
          fontWeight: 600,
          color: 'primary.main',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        {HOOK_INFO.linkText}
        <ArrowOutwardIcon sx={{ fontSize: 13 }} />
      </Box>
    </Box>
  );
}
