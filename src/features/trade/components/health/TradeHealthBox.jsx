import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { AI_HEALTH } from '../.././mock/tradeMockData';

// AI 代币健康分析：评分 + 逐项检测结果
export default function TradeHealthBox() {
  const { score, level, checks } = AI_HEALTH;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary' }}>
          AI 代币健康分析
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 0.5,
            px: 1,
            py: 0.25,
            borderRadius: 1,
            bgcolor: 'rgba(199,248,76,0.08)',
          }}
        >
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: 'primary.main' }}>{score}</Typography>
          <Typography sx={{ fontSize: 10.5, color: 'primary.main' }}>/ 100 · {level}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.875 }}>
        {checks.map((item) => (
          <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            {item.pass ? (
              <CheckCircleOutlineIcon sx={{ fontSize: 15, color: 'success.main' }} />
            ) : (
              <ErrorOutlineIcon sx={{ fontSize: 15, color: '#F2C94C' }} />
            )}
            <Typography sx={{ fontSize: 12.5, color: item.pass ? 'text.secondary' : 'text.primary' }}>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
