import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TagBox from '../../../../components/shared/TagBox';
import { TOP_HOLDERS, TOP_HOLDERS_TOTAL_COUNT } from '../.././mock/tradeMockData';

const HEAD_CELLS = [
  { key: 'rank', label: '排名', align: 'left' },
  { key: 'address', label: '地址', align: 'left' },
  { key: 'amount', label: '持有数量', align: 'right' },
  { key: 'percent', label: '占比', align: 'right' },
];

// variant: 'desktop' -> 表格；'mobile' -> 紧凑列表（移动端 tab 切换里复用）
export default function HoldingsBox({ variant = 'desktop', title = `持有人分布（前 ${TOP_HOLDERS_TOTAL_COUNT}）` }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {title && (
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary', mb: 1 }}>
          {title}
        </Typography>
      )}

      {variant === 'desktop' ? (
        <TableContainer sx={{ flex: 1, overflowX: 'auto' }}>
          <Table size="small" sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                {HEAD_CELLS.map((cell) => (
                  <TableCell
                    key={cell.key}
                    align={cell.align}
                    sx={{ color: 'text.tertiary', fontSize: 11.5, borderColor: 'divider', whiteSpace: 'nowrap', px: 1 }}
                  >
                    {cell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {TOP_HOLDERS.map((holder) => (
                <TableRow key={holder.rank} hover>
                  <TableCell sx={{ borderColor: 'divider', px: 1, fontSize: 12, color: 'text.tertiary' }}>
                    {holder.rank}
                  </TableCell>
                  <TableCell sx={{ borderColor: 'divider', px: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                        {holder.address}
                      </Typography>
                      {holder.tag && <TagBox label={holder.tag} tone="accent" />}
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ borderColor: 'divider', px: 1, fontSize: 12, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                    {holder.amount}
                  </TableCell>
                  <TableCell align="right" sx={{ borderColor: 'divider', px: 1, fontSize: 12, color: 'text.primary', whiteSpace: 'nowrap' }}>
                    {holder.percent}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {TOP_HOLDERS.map((holder, index) => {
            const isLast = index === TOP_HOLDERS.length - 1;
            return (
              <Box
                key={holder.rank}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 1,
                  borderBottom: isLast ? 'none' : '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 11, color: 'text.tertiary', width: 18, flexShrink: 0 }}>
                    {holder.rank}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {holder.address}
                  </Typography>
                  {holder.tag && <TagBox label={holder.tag} tone="accent" />}
                </Box>

                <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'text.primary' }}>{holder.percent}%</Typography>
                  <Typography sx={{ fontSize: 10.5, color: 'text.tertiary' }}>{holder.amount}</Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
