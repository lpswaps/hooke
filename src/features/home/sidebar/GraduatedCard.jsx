import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import TokenAvatar from '../../../components/shared/TokenAvatar';
import ChangeText from '../../../components/shared/ChangeText';
import { colors } from '../../../styles/theme';
import { formatCompact, round2 } from '../../../utils/format';
import { useGraduatedTokens } from '../../../hooks/useGraduatedTokens';
import TimeAgo from 'react-timeago';

const PAGE_SIZE = 5;

// 头像底色轮换：接口没有下发颜色字段，这里按下标轮换固定的三种主题色
const AVATAR_COLORS = [colors.positive, '#7c6cff', '#35b8ff'];

export default function GraduatedCard() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGraduatedTokens({
    page,
    pageSize: PAGE_SIZE,
  });

  const tokens = data?.data ?? [];
  const pagination = data?.pagination;
  const total = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 1;

  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(totalPages, prev + 1));

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        width: '100%',
        minHeight: 300,
        border: '1px solid',
        borderColor: 'divider',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
      }}
    >
      {/* ================= 标题栏 ================= */}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <RocketLaunchIcon sx={{ fontSize: 16, color: 'primary.main' }} />
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>
            已毕业代币
          </Typography>
        </Box>

        {total > 0 && (
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
            共 {total} 个
          </Typography>
        )}
      </Box>

      {/* ================= Loading（骨架屏） ================= */}

      {isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 1.25,
                borderBottom: index === PAGE_SIZE - 1 ? 'none' : '1px solid',
                borderColor: 'divider',
              }}
            >
              <Skeleton variant="rounded" width={32} height={32} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Skeleton variant="text" width="55%" height={16} />
                <Skeleton variant="text" width="75%" height={14} />
              </Box>
              <Skeleton variant="rounded" width={54} height={26} />
              <Skeleton variant="text" width={40} height={20} />
            </Box>
          ))}
        </Box>
      )}

      {/* ================= Empty ================= */}

      {!isLoading && tokens.length === 0 && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            color: 'text.secondary',
          }}
        >
          <RocketLaunchIcon sx={{ fontSize: 22, opacity: 0.4 }} />
          <Typography sx={{ fontSize: 12 }}>暂无毕业代币</Typography>
        </Box>
      )}

      {/* ================= Token List ================= */}

      {!isLoading && tokens.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {tokens.map((item, index) => {
            const quoteSymbol = item.quoteAsset?.symbol ?? '';
            const quoteDecimals = item.quoteAsset?.decimals ?? 18;

            const isPositive = Number(item.priceChange24h) >= 0;
            const sparklinePoints = Array.isArray(item.sparkline24h)
              ? item.sparkline24h.map(Number)
              : [];

            return (
              <Box
                key={item.token}
                onClick={() => navigate(`/trade/${item.token}`)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 1.25,
                  px: 1,
                  mx: -0.5,
                  cursor: 'pointer',
                  borderRadius: 1,
                  borderColor: 'divider',
                  minWidth: 0,
                  transition: 'background-color 0.15s ease',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
                }}
              >
                {/* Avatar */}
                <TokenAvatar
                  symbol={(item.symbol || item.name || '?').toUpperCase()}
                  color={AVATAR_COLORS[index % AVATAR_COLORS.length]}
                  size={32}
                  fontSize={12}
                />

                {/* Token Info */}
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.symbol || item.name}
                    </Typography>

                    {item.hasHook && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 30,
                          height: 15,
                          borderRadius: '10%',
                          border: '1px solid',
                          borderColor: '#7567ff',
                          color: '#8477f7',
                          fontSize: 10,
                          flexShrink: 0,
                        }}
                      >
                        hook
                      </Box>
                    )}
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 10.5,
                      color: 'text.secondary',
                      mt: 0.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatCompact(item.volume24hRaw, quoteDecimals)} {quoteSymbol}
                  </Typography>
                </Box>



                {/* Change / Volume */}
                <Box sx={{ minWidth: 52, textAlign: 'right', flexShrink: 0 }}>
                  <ChangeText value={round2(item.priceChange24h)} size={11.5} weight={700} />
                  <Typography
                    sx={{ fontSize: 9, color: 'text.secondary', mt: 0.2, whiteSpace: 'nowrap' }}
                  >
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.35 }}>
                    <Box
                      sx={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        boxShadow: '0 0 6px rgba(200,245,66,0.7)',
                        flexShrink: 0,
                      }}
                    />
                    <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>
                      <TimeAgo date={item.graduatedAt} />

                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {/* ================= Pagination ================= */}

      {!isLoading && totalPages > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            pt: 1.25,
            mt: 0.5,

            borderColor: 'divider',
          }}
        >
          <IconButton
            size="small"
            onClick={handlePrev}
            disabled={page <= 1}
            sx={{
              width: 26,
              height: 26,
              color: 'text.secondary',
              '&:hover': { color: 'primary.main', bgcolor: 'rgba(200,245,66,0.06)' },
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: 17 }} />
          </IconButton>

          <Typography
            sx={{ fontSize: 11, color: 'text.secondary', minWidth: 45, textAlign: 'center' }}
          >
            {page} / {totalPages}
          </Typography>

          <IconButton
            size="small"
            onClick={handleNext}
            disabled={page >= totalPages}
            sx={{
              width: 26,
              height: 26,
              color: 'text.secondary',
              '&:hover': { color: 'primary.main', bgcolor: 'rgba(200,245,66,0.06)' },
            }}
          >
            <ChevronRightIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}


