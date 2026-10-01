import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import TokenOutlinedIcon from '@mui/icons-material/TokenOutlined';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import { colors } from '../../styles/theme';

const OPTIONS = [
  {
    value: 'normal',
    label: '普通代币',
    desc: '标准代币，无税费、无 Hook 逻辑',
    Icon: TokenOutlinedIcon,
  },
  {
    value: 'hook',
    label: 'Hook 代币',
    desc: '可配置买卖税与自定义 Hook 合约',
    Icon: BoltRoundedIcon,
  },
];

export default function ModeToggle({ mode, onChange }) {
  return (
    <ToggleButtonGroup
      value={mode}
      exclusive
      fullWidth
      onChange={(e, v) => v && onChange(v)}
      sx={{
        bgcolor: colors.bgElevated,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 0,
        p: 0.5,
        gap: 0,
        overflow: 'hidden',
      }}
    >
      {OPTIONS.map(({ value, label, desc, Icon }, index) => (
        <ToggleButton
          key={value}
          value={value}
          disableRipple
          sx={{
            flex: 1,
            minWidth: 0,
            position: 'relative',
            zIndex: index === 0 ? 2 : 1,
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 0.25,

            py: 1.1,
            px: 2,

            border: 'none !important',
            borderRadius: '0 !important',
            textTransform: 'none',

            color: 'text.secondary',

            // 去掉未选中状态的 hover 背景
            '&:hover': {
              bgcolor: 'transparent',
              color: 'text.secondary',
            },

            // 左边梯形
            ...(index === 0
              ? {
                clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)',
                marginRight: '-8%',
                paddingRight: '12%',
              }
              : {
                // 右边梯形
                clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0 100%)',
                paddingLeft: '12%',
              }),

            '&.Mui-selected': {
              bgcolor: colors.accentDim,
              color: 'primary.main',
            },

            '&.Mui-selected:hover': {
              bgcolor: colors.accentDim,
              color: 'primary.main',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
            }}
          >
            <Icon sx={{ fontSize: 17 }} />

            <Typography
              sx={{
                fontSize: 13.5,
                fontWeight: 700,
              }}
            >
              {label}
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: 11,
              color: colors.textTertiary,
              fontWeight: 400,
              textAlign: 'left',
              lineHeight: 1.3,
            }}
          >
            {desc}
          </Typography>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}