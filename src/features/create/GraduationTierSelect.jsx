import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FieldLabel from './FieldLabel';
import { colors } from '../../styles/theme';

const TIERS = [
  { value: 16, desc: '轻量启动，门槛低' },
  { value: 24, desc: '标准档位，较均衡' },
  { value: 48, desc: '高门槛，流动性更足' },
];

export default function GraduationTierSelect({ value, error, onChange }) {
  return (
    <Box>
      <FieldLabel
        label="毕业目标"
        required
        tip="Bonding Curve 累计到所选 BNB 数量后，代币将自动「毕业」并注入 DEX 流动性池，开放自由交易"
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        {TIERS.map((t) => {
          const selected = value === t.value;
          return (
            <Box
              key={t.value}
              onClick={() => onChange(t.value)}
              sx={{
                flex: 1,
                cursor: 'pointer',
                textAlign: 'center',
                py: 1.1,
                px: 0.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: selected ? 'primary.main' : (error ? 'error.main' : 'divider'),
                bgcolor: selected ? colors.accentDim : colors.bgElevated,
                transition: 'border-color .15s ease, background-color .15s ease',
                '&:hover': {
                  borderColor: selected ? 'primary.main' : colors.borderStrong,
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: selected ? 'primary.main' : 'text.primary',
                }}
              >
                {t.value} BNB
              </Typography>
              <Typography sx={{ fontSize: 10.5, color: colors.textTertiary, mt: 0.25 }}>
                {t.desc}
              </Typography>
            </Box>
          );
        })}
      </Box>
      {error && (
        <Typography sx={{ fontSize: 11, color: 'error.main', mt: 0.5 }}>{error}</Typography>
      )}
    </Box>
  );
}
