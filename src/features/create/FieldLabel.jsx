import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { colors } from '../../styles/theme';

// 表单字段的统一标题行：标签 + 必填星号 + 说明 Tooltip（可选）+ 右侧插槽（可选，比如字数统计）
export default function FieldLabel({ label, required = false, tip, right }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 0.75,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>
          {label}
          {required && (
            <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
              *
            </Box>
          )}
        </Typography>
        {tip && (
          <Tooltip title={tip} arrow placement="top">
            <InfoOutlinedIcon sx={{ fontSize: 14, color: colors.textTertiary, cursor: 'help' }} />
          </Tooltip>
        )}
      </Box>
      {right}
    </Box>
  );
}
