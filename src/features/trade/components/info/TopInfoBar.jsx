import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import CheckIcon from '@mui/icons-material/Check';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import XIcon from '@mui/icons-material/X';
import TelegramIcon from '@mui/icons-material/Telegram';
import DataTag from '../../../../components/tag/DataTag';
import TokenAvatar from '../../../../components/shared/TokenAvatar';
import TagBox from '../../../../components/shared/TagBox';
import ChangeText from '../../../../components/shared/ChangeText';
import ProgressBar from '../../../../components/shared/ProgressBar';
import { shortenAddress } from '../../../../utils/format';
import { formatCompact } from '../../../../utils/format';
import { formatCurveRemaining } from '../../../../utils/format';
import { useTokenDetail } from '../../../../hooks/useTokenDetail';

export default function TopInfoBar({ tokenAddress }) {
  const [copied, setCopied] = useState(false);
  const { data } = useTokenDetail(tokenAddress);
  const token = data?.data ?? {};
  const quoteAsset = token.quoteAsset ?? {};
  const usdRate = Number(quoteAsset.usdRate) || 0;
  const quoteSymbol = quoteAsset.symbol ?? '';

  // 市值单独算，空值时给 null
  const marketCap =
    token.marketCapRaw != null && usdRate
      ? Number(token.marketCapRaw) * usdRate
      : null;

  const handleCopy = () => {
    if (!token.token) return;

    navigator.clipboard?.writeText(token.token).catch(() => { });
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  const socialLinks = [
    {
      icon: LanguageOutlinedIcon,
      url: '',
      label: '官网',
    },
    {
      icon: XIcon,
      url: '',
      label: 'X',
    },
    {
      icon: TelegramIcon,
      url: '',
      label: 'Telegram',
    },
  ].filter((item) => item.url);

  const remainingSupply =
    token.curveSupplyRaw && token.tokensSoldRaw
      ? formatCurveRemaining(
        token.curveSupplyRaw,
        token.tokensSoldRaw,
      )
      : '';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        height: '100%',
        justifyContent: 'space-between',
      }}
    >
      {/* 上半部分 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
          flexWrap: 'wrap',
        }}
      >
        {/* 左侧：头像 / 名称 / 地址 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            minWidth: 0,
          }}
        >
          <TokenAvatar
            symbol={token.symbol || ''}
            size={44}
            fontSize={17}
          />

          <Box sx={{ minWidth: 0 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                flexWrap: 'wrap',
              }}
            >
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'text.primary',
                  whiteSpace: 'nowrap',
                }}
              >
                {token.symbol || ''}
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  color: 'text.secondary',
                  whiteSpace: 'nowrap',
                }}
              >
                {token.name || ''}
              </Typography>

              {/* 当前接口没有 chain，暂时不显示 */}
              {token.chain && (
                <TagBox
                  label={token.chain}
                  tone="neutral"
                />
              )}
            </Box>

            {/* 地址 */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                mt: 0.375,
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                  color: 'text.tertiary',
                  fontFamily: 'monospace',
                  whiteSpace: 'nowrap',
                }}
              >
                {shortenAddress(token.token || '')}
              </Typography>

              {token.token && (
                <Tooltip title={copied ? '已复制' : '复制地址'}>
                  <IconButton
                    size="small"
                    onClick={handleCopy}
                    sx={{
                      p: 0.25,
                      color: copied
                        ? 'success.main'
                        : 'text.tertiary',
                    }}
                  >
                    {copied ? (
                      <CheckIcon sx={{ fontSize: 14 }} />
                    ) : (
                      <ContentCopyOutlinedIcon
                        sx={{ fontSize: 14 }}
                      />
                    )}
                  </IconButton>
                </Tooltip>
              )}

              {socialLinks.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    ml: 0.5,
                  }}
                >
                  {socialLinks.map(
                    ({ icon: Icon, url, label }) => (
                      <Tooltip key={label} title={label}>
                        <IconButton
                          size="small"
                          component="a"
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          sx={{
                            p: 0.25,
                            color: 'text.tertiary',
                          }}
                        >
                          <Icon sx={{ fontSize: 15 }} />
                        </IconButton>
                      </Tooltip>
                    ),
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Box>


        {/* 右侧：价格 / 涨跌 */}
        <Box
          sx={{
            textAlign: { xs: 'left', sm: 'right' },
          }}
        >
          <Box
            sx={{
              fontSize: 20,
              fontWeight: 700,
              color: 'text.primary',
              lineHeight: 1.2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>市值</Typography>
              <span>
                {marketCap != null ? `$${formatCompact(marketCap)}` : '--'}
              </span>
            </Box>
          </Box>

          {token.priceChange24h != null ? (
            <ChangeText
              value={token.priceChange24h}
              size={13}
              weight={700}
            />
          ) : (
            <Box sx={{ height: 20 }} />
          )}
        </Box>
      </Box>

      {/* 下半部分 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        {/* 关键指标 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: .5,
            flexWrap: 'wrap',
            rowGap: 1,
          }}
        >
          <DataTag>
            {`24H ( ${quoteSymbol} ) :  ${formatCompact(token.volume24hRaw ?? 0)}`}
          </DataTag>
          <DataTag>
            {`TXNS :  ${token.txCount ?? 0}`}
          </DataTag>
          <DataTag>
            {`BUY :  ${token.maxBuyFeeBps != null ? token.maxBuyFeeBps / 100 : 0} %`}
          </DataTag>
          <DataTag>
            {`SELL : ${token.maxSellFeeBps != null ? token.maxSellFeeBps / 100 : 0} %`}
          </DataTag>
        </Box>

        {/* Bonding Curve */}
        <Box
          sx={{
            minWidth: 140,
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 0.375,
            }}
          >
            <Typography></Typography>
            <Typography
              sx={{
                fontSize: 10.5,
                color: 'text.tertiary',
              }}
            >
              {remainingSupply
                ? `剩余可售 ${remainingSupply}`
                : ''}
            </Typography>
          </Box>

          <ProgressBar
            value={token.progressPct ?? 0}
            width="100%"
            showLabel={false}
          />
        </Box>
      </Box>
    </Box>
  );
}