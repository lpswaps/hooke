import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FieldLabel from './FieldLabel';
import { colors } from '../../styles/theme';

const PAIR_TOKENS = [
  { value: 'BNB', label: 'BNB', color: '#F0B90B' },
  { value: 'USDT', label: 'USDT', color: '#26A17B' },
];

export default function PairTokenSelect({ value, error, onChange }) {
  return (
    <Box>
      <FieldLabel
        label="配对代币"
        required
        tip="新代币将与所选资产组成交易对，用户使用该资产买入或卖出你的代币"
      />
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        size="small"
        error={!!error}
        MenuProps={{ PaperProps: { sx: { bgcolor: colors.bgElevated } } }}
        sx={{
          bgcolor: colors.bgElevated,
          borderRadius: 2,
          fontSize: 13.5,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
        }}
      >
        {PAIR_TOKENS.map((tkn) => (
          <MenuItem key={tkn.value} value={tkn.value} sx={{ fontSize: 13.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 16, height: 16, borderRadius: '4px', bgcolor: tkn.color }} />
              {tkn.label}
            </Box>
          </MenuItem>
        ))}
      </Select>
      {error && (
        <Typography sx={{ fontSize: 11, color: 'error.main', mt: 0.5 }}>{error}</Typography>
      )}
    </Box>
  );
}
