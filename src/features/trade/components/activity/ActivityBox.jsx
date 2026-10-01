import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TRADE_RECORDS } from '../.././mock/tradeMockData';

const HEAD_CELLS = [
  { key: 'time', label: '时间', align: 'left' },
  { key: 'type', label: '类型', align: 'left' },
  { key: 'price', label: '价格', align: 'right' },
  { key: 'tokenAmount', label: '数量', align: 'right' },
  { key: 'usdAmount', label: '金额', align: 'right' },
  { key: 'address', label: '地址', align: 'right' },
];

// variant: 'desktop' -> 表格；'mobile' -> 紧凑列表（移动端 tab 切换里复用）
export default function ActivityBox({ variant = 'desktop', title = '最新交易' }) {
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
              {TRADE_RECORDS.map((trade, index) => {
                const isBuy = trade.type === 'buy';
                return (
                  <TableRow key={index} hover>
                    <TableCell sx={{ borderColor: 'divider', px: 1, fontSize: 12, color: 'text.tertiary', whiteSpace: 'nowrap' }}>
                      {trade.time}
                    </TableCell>
                    <TableCell sx={{ borderColor: 'divider', px: 1 }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 700, color: isBuy ? 'success.main' : 'error.main' }}>
                        {isBuy ? '买入' : '卖出'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ borderColor: 'divider', px: 1, fontSize: 12, color: 'text.primary', whiteSpace: 'nowrap' }}>
                      {trade.price}
                    </TableCell>
                    <TableCell align="right" sx={{ borderColor: 'divider', px: 1, fontSize: 12, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                      {trade.tokenAmount}
                    </TableCell>
                    <TableCell align="right" sx={{ borderColor: 'divider', px: 1, fontSize: 12, color: 'text.primary', whiteSpace: 'nowrap' }}>
                      {trade.usdAmount}
                    </TableCell>
                    <TableCell align="right" sx={{ borderColor: 'divider', px: 1, fontSize: 12, color: 'text.tertiary', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                      {trade.address}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {TRADE_RECORDS.map((trade, index) => {
            const isBuy = trade.type === 'buy';
            const isLast = index === TRADE_RECORDS.length - 1;
            return (
              <Box
                key={index}
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
                  <Box
                    sx={{
                      px: 0.75,
                      py: 0.125,
                      borderRadius: 0.5,
                      bgcolor: isBuy ? 'rgba(143,209,79,0.12)' : 'rgba(241,106,106,0.12)',
                      flexShrink: 0,
                    }}
                  >
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: isBuy ? 'success.main' : 'error.main' }}>
                      {isBuy ? '买入' : '卖出'}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 12, color: 'text.tertiary', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {trade.address}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'text.primary' }}>{trade.usdAmount}</Typography>
                  <Typography sx={{ fontSize: 10.5, color: 'text.tertiary' }}>{trade.time}</Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
