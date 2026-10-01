import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Skeleton from '@mui/material/Skeleton';
import { colors } from '../../../styles/theme';
import ChangeText from '../../../components/shared/ChangeText';
import ProgressBar from '../../../components/shared/ProgressBar';
import TokenAvatar from '../../../components/shared/TokenAvatar';
import MiniSparkline from '../MiniSparkline';
import { HEAD_CELLS, CELL_PX } from './tokenListConfig';
import { round2, formatCompact } from '../../../utils/format';
import { TimeCell } from '../../../components/time/TimeCell';
import TokenLogoWithPair from '../../../components/tokenLogo/TokenLogoPair';
import { TokenLogo } from '../../../components/tokenLogo';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';


// 数字类单元格统一加上等宽数字样式，价格/百分比对齐更整齐
const numericSx = { fontVariantNumeric: 'tabular-nums' };

// 按 key 取列宽，避免直接写 HEAD_CELLS[数字下标]
// （数组顺序一旦调整，写死的下标就会全部错位，之前这里就错过一次）
const widthOf = (key) => HEAD_CELLS.find((cell) => cell.key === key)?.width;

const ROW_HEIGHT = 60;
const SKELETON_ROW_COUNT = 8;

/** 加载中占位行：按真实表格的列结构，逐列渲染对应形状的骨架条 */
function SkeletonRow({ rowIndex }) {
  return (
    <TableRow
      sx={{
        height: ROW_HEIGHT,
        '& .MuiTableCell-root': { height: ROW_HEIGHT, py: 0, boxSizing: 'border-box' },
      }}
    >
      <TableCell sx={{ borderColor: 'divider', px: CELL_PX, width: widthOf('token') }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Skeleton variant="circular" width={28} height={28} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={16} />
            <Skeleton variant="text" width="40%" height={13} />
          </Box>
        </Box>
      </TableCell>
      <TableCell align="center" sx={{ borderColor: 'divider', px: CELL_PX, width: widthOf('trend') }}>
        <Skeleton variant="rounded" width={56} height={24} sx={{ mx: 'auto' }} />
      </TableCell>
      <TableCell align="center" sx={{ borderColor: 'divider', px: CELL_PX, width: widthOf('progress') }}>
        <Skeleton variant="rounded" width="80%" height={8} sx={{ mx: 'auto' }} />
      </TableCell>
      <TableCell align="right" sx={{ borderColor: 'divider', px: CELL_PX, width: widthOf('marketCap') }}>
        <Skeleton variant="text" width="70%" sx={{ ml: 'auto' }} />
      </TableCell>
      <TableCell align="right" sx={{ borderColor: 'divider', px: CELL_PX, width: widthOf('age') }}>
        <Skeleton variant="text" width="60%" sx={{ ml: 'auto' }} />
      </TableCell>
      <TableCell align="right" sx={{ borderColor: 'divider', px: CELL_PX, width: widthOf('tax') }}>
        <Skeleton variant="text" width="65%" sx={{ ml: 'auto' }} />
      </TableCell>
      <TableCell align="right" sx={{ borderColor: 'divider', px: CELL_PX, width: widthOf('holders') }}>
        <Skeleton variant="text" width="50%" sx={{ ml: 'auto' }} />
      </TableCell>
      <TableCell align="right" sx={{ borderColor: 'divider', px: CELL_PX, width: widthOf('volume24h') }}>
        <Skeleton variant="text" width="70%" sx={{ ml: 'auto' }} />
      </TableCell>
      <TableCell align="right" sx={{ borderColor: 'divider', px: CELL_PX, width: widthOf('change1h') }}>
        <Skeleton variant="text" width="55%" sx={{ ml: 'auto' }} />
      </TableCell>
      <TableCell align="right" sx={{ borderColor: 'divider', px: CELL_PX, width: widthOf('change12h') }}>
        <Skeleton variant="text" width="55%" sx={{ ml: 'auto' }} />
      </TableCell>
      <TableCell align="right" sx={{ borderColor: 'divider', px: CELL_PX, width: widthOf('change24h') }}>
        <Skeleton variant="text" width="55%" sx={{ ml: 'auto' }} />
      </TableCell>
      <TableCell align="center" sx={{ borderColor: 'divider', px: CELL_PX, width: widthOf('playbook') }}>
        <Skeleton variant="rounded" width={44} height={22} sx={{ mx: 'auto' }} />
      </TableCell>
    </TableRow>
  );
}

function TableHeaderRow() {
  return (
    <TableHead>
      <TableRow>
        {HEAD_CELLS.map((cell) => (
          <TableCell
            key={cell.key}
            align={cell.align}
            sx={{
              width: cell.width,
              minWidth: cell.width,
              color: 'text.secondary',
              fontSize: 12,
              fontWeight: 600,
              borderColor: 'divider',
              whiteSpace: 'nowrap',
              px: CELL_PX,
            }}
          >
            {cell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

/**
 * 宽屏（≥600px）表格视图，列数较多时可横向滚动。
 * @param {boolean} isLoading - 加载中时渲染骨架屏占位行，保持表头/列宽不变，避免布局跳动
 */
export default function DesktopTokenTable({ tokens, isLoading, onPlaybookClick }) {
  const navigate = useNavigate();

  return (
    <TableContainer sx={{ flex: 1, overflowX: 'auto' }}>
      <Table sx={{ width: '100%', tableLayout: 'fixed' }} size="small">
        <TableHeaderRow />

        <TableBody>
          {isLoading
            ? Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => <SkeletonRow key={`skeleton-${i}`} rowIndex={i} />)
            : tokens.map((token) => {
              const isPositive24h = token.priceChange24h >= 0;

              return (
                <TableRow
                  key={token.token}
                  hover
                  onClick={() => navigate(`/trade/${token.token}`)}
                  sx={{
                    cursor: 'pointer',
                    height: ROW_HEIGHT,
                    '&:first-of-type td': { borderTop: 0 },
                    '& .MuiTableCell-root': { height: ROW_HEIGHT, py: 0, boxSizing: 'border-box' },
                  }}
                >
                  {/* 代币 */}
                  <TableCell sx={{ borderColor: 'divider', px: CELL_PX, width: widthOf('token') }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                      <TokenLogoWithPair
                        tokenLogoUrl={TokenLogo(token.quoteAsset.address)}
                        tokenSymbol={token.symbol}
                        quoteLogoUrl={TokenLogo(token.quoteAsset.address)}
                        quoteSymbol={token.quoteAsset.symbol}
                        size="medium"
                      />

                      {/* <TokenAvatar symbol={token.symbol} color={token.avatarColor} size={28} /> */}
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: 'text.primary',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {token.symbol}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 11,
                            color: 'text.secondary',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {token.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* 走势图：颜色跟随24h涨跌方向 */}
                  <TableCell align="center" sx={{ borderColor: 'divider', px: CELL_PX, width: widthOf('trend') }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <MiniSparkline
                        points={token.sparkline24h}
                        width={56}
                        height={24}
                        color={isPositive24h ? colors.positive : colors.negative}
                        strokeWidth={1.5}
                      />
                    </Box>
                  </TableCell>

                  {/* 进度 */}
                  <TableCell align="center" sx={{ borderColor: 'divider', px: CELL_PX, width: widthOf('progress') }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <ProgressBar value={round2(token.progressPct)} />
                    </Box>
                  </TableCell>

                  {/* 创建时间 */}
                  <TableCell
                    align="right"
                    sx={{ borderColor: 'divider', color: 'text.secondary', fontSize: 13, px: CELL_PX, width: widthOf('age'), whiteSpace: 'nowrap' }}
                  >
                    <TimeCell date={token.createdAt} />
                  </TableCell>

                  {/* 市值 */}
                  <TableCell
                    align="right"
                    sx={{ borderColor: 'divider', color: 'text.primary', fontSize: 13, px: CELL_PX, width: widthOf('marketCap'), whiteSpace: 'nowrap', ...numericSx }}
                  >
                    ${formatCompact(token.marketCapRaw)}
                  </TableCell>

                  {/* 买/卖税 */}
                  <TableCell
                    align="right"
                    sx={{ borderColor: 'divider', color: 'text.primary', fontSize: 13, px: CELL_PX, width: widthOf('tax'), whiteSpace: 'nowrap', ...numericSx }}
                  >
                    {token.maxBuyFeeBps / 100}% | {token.maxSellFeeBps / 100}%
                  </TableCell>

                  {/* 交易数 */}
                  <TableCell
                    align="right"
                    sx={{ borderColor: 'divider', color: 'text.secondary', fontSize: 13, px: CELL_PX, width: widthOf('holders'), whiteSpace: 'nowrap', ...numericSx }}
                  >
                    {token.txCount}
                  </TableCell>

                  {/* 24h交易量 */}
                  <TableCell
                    align="right"
                    sx={{
                      borderColor: 'divider',
                      color: 'text.secondary',
                      fontSize: 13,
                      px: CELL_PX,
                      width: widthOf('volume24h'),
                      whiteSpace: 'nowrap',
                      ...numericSx,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 0.5,
                        ml: 'auto',
                      }}
                    >
                      <Box component="span">
                        {formatCompact(token.volume24hRaw)}
                      </Box>

                      <Avatar
                        src={TokenLogo(token.quoteAsset.address)}
                        alt={token.quoteAsset.symbol}
                        sx={{
                          width: 16,
                          height: 16,
                          flexShrink: 0,
                        }}
                      />
                    </Box>
                  </TableCell>

                  {/* 1h涨跌 */}
                  <TableCell align="right" sx={{ borderColor: 'divider', px: CELL_PX, width: widthOf('change1h'), ...numericSx }}>
                    <ChangeText value={round2(token.priceChange1h)} />
                  </TableCell>

                  {/* 12h涨跌 */}
                  <TableCell align="right" sx={{ borderColor: 'divider', px: CELL_PX, width: widthOf('change12h'), ...numericSx }}>
                    <ChangeText value={round2(token.priceChange12h)} />
                  </TableCell>

                  {/* 24h涨跌 */}
                  <TableCell align="right" sx={{ borderColor: 'divider', px: CELL_PX, width: widthOf('change24h'), ...numericSx }}>
                    <ChangeText value={round2(token.priceChange24h)} />
                  </TableCell>

                  {/* Playbook */}
                  <TableCell align="center" sx={{ borderColor: 'divider', px: CELL_PX, width: widthOf('playbook') }}>
                    <Chip
                      label="查看"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();        // 👈 阻止冒泡，防止触发 TableRow 的 onClick
                        onPlaybookClick(token);
                      }}
                      clickable
                      sx={{

                        height: 22,
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: 'primary.main',
                        bgcolor: 'transparent',
                        border: '1px solid',
                        borderColor: 'primary.main',
                        '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' },
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}