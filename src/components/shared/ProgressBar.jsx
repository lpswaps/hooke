import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// 发射进度条：数值 + 高亮细条，代币列表桌面表格 / 移动端卡片共用
export default function ProgressBar({ value, width = 58, showLabel = true }) {
  return (
    <Box sx={{ width }}>
      {showLabel && (
        <Typography
          sx={{
            fontSize: 10.5,
            fontWeight: 700,
            color: 'primary.main',
            mb: 0.5,
          }}
        >
          {value}%
        </Typography>
      )}
      <Box
        sx={{
          width: '100%',
          height: 5,
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: `${value}%`,
            height: '100%',
            borderRadius: 3,
            bgcolor: 'primary.main',
            boxShadow: '0 0 6px rgba(163,230,53,0.55)',
            transition: 'width 0.3s ease',
          }}
        />
      </Box>
    </Box>
  );
}
