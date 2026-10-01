// ============================================================
// 交易详情页假数据
// 仅用于 UI 展示占位，后续接入真实接口后请直接删除本文件，
// 并把各组件里 import 的地方替换成真实接口返回的数据
// ============================================================

// ------------------------------------------------------------
// TopInfoBar：代币头部信息
// ------------------------------------------------------------
export const TOKEN_DETAIL = {
  symbol: 'SHOOK',
  name: 'Hooke',
  avatarColor: '#F2C94C',
  chain: 'BSC',
  address: '0x8a3F...9C2e',
  fullAddress: '0x8a3F1b6c9E4d2a7F5b8C1d0E9a3F6b8C9D0E1F2A',
  website: 'https://hooke.example',
  twitter: 'https://twitter.com/hooke_example',
  telegram: 'https://t.me/hooke_example',

  price: '$0.0000482',
  priceUsd: 0.0000482,
  change24h: 42.6,

  marketCap: '$3.12M',
  volume24h: '$1.24M',
  holders: 2481,
  liquidity: '$412K',
  lpLocked: '100%',
  buyTax: 5,
  sellTax: 5,

  bondingProgress: 78,
  bondingTargetMarketCap: '$4.0M',
};

// ------------------------------------------------------------
// ChartBox：K 线周期切换选项（图表本身先不实现）
// ------------------------------------------------------------
export const CHART_INTERVALS = ['1m', '5m', '1h', '1d'];

// ------------------------------------------------------------
// TradeHealthBox：AI 代币健康分析假数据
// ------------------------------------------------------------
export const AI_HEALTH = {
  score: 82,
  level: '较安全',
  checks: [
    { label: '合约已开源', pass: true },
    { label: '未检测到黑名单函数', pass: true },
    { label: 'LP 已锁仓', pass: true },
    { label: '持有人集中度偏高', pass: false },
    { label: '未检测到增发权限', pass: true },
  ],
};

// ------------------------------------------------------------
// HookInfoBox：hook 机制介绍
// ------------------------------------------------------------
export const HOOK_INFO = {
  title: '该代币的 Hook 机制',
  description:
    '创建者为该代币启用了自定义 Hook：每笔交易将自动抽取部分税费注入流动性池，并对持有超过 24 小时的地址给予手续费返还。',
  linkText: '查看 Hook 详情文档',
  linkUrl: 'https://hooke.example/docs/hooks',
};

// ------------------------------------------------------------
// ActivityBox：最新交易记录假数据
// ------------------------------------------------------------
export const TRADE_RECORDS = [
  { time: '10:42:18', type: 'buy', address: '0x3a...7f2b', price: '$0.0000482', tokenAmount: '1,038,500', usdAmount: '$500.20' },
  { time: '10:41:52', type: 'sell', address: '0x6e...4d3a', price: '$0.0000475', tokenAmount: '526,300', usdAmount: '$250.00' },
  { time: '10:41:10', type: 'buy', address: '0x9f...2b7c', price: '$0.0000471', tokenAmount: '848,200', usdAmount: '$399.50' },
  { time: '10:40:33', type: 'buy', address: '0x5c...1e9d', price: '$0.0000468', tokenAmount: '2,140,000', usdAmount: '$1,001.50' },
  { time: '10:39:58', type: 'sell', address: '0x1b...8a90', price: '$0.0000462', tokenAmount: '312,400', usdAmount: '$144.30' },
  { time: '10:39:21', type: 'buy', address: '0x7d...3c11', price: '$0.0000459', tokenAmount: '95,800', usdAmount: '$44.00' },
  { time: '10:38:47', type: 'buy', address: '0x2e...9f04', price: '$0.0000455', tokenAmount: '1,502,000', usdAmount: '$683.40' },
  { time: '10:38:05', type: 'sell', address: '0x4a...0d77', price: '$0.0000450', tokenAmount: '660,900', usdAmount: '$297.40' },
  { time: '10:37:39', type: 'buy', address: '0x8c...5b62', price: '$0.0000448', tokenAmount: '210,000', usdAmount: '$94.10' },
  { time: '10:36:58', type: 'buy', address: '0x0f...6e13', price: '$0.0000441', tokenAmount: '3,020,500', usdAmount: '$1,332.00' },
];

// ------------------------------------------------------------
// HoldingsBox：持仓前 50 明细假数据（此处放前 10 条示例）
// ------------------------------------------------------------
export const TOP_HOLDERS = [
  { rank: 1, address: '0x8a...9c2e', amount: '312,400,000', percent: 12.4, tag: 'LP' },
  { rank: 2, address: '0x2f...7b18', amount: '188,200,000', percent: 7.5, tag: '开发者' },
  { rank: 3, address: '0x9d...4e51', amount: '96,700,000', percent: 3.8 },
  { rank: 4, address: '0x5b...0a33', amount: '74,300,000', percent: 2.9 },
  { rank: 5, address: '0x1c...8f76', amount: '61,900,000', percent: 2.4 },
  { rank: 6, address: '0x6e...2d09', amount: '52,100,000', percent: 2.1 },
  { rank: 7, address: '0x3a...5c44', amount: '45,600,000', percent: 1.8 },
  { rank: 8, address: '0x7f...1b82', amount: '39,800,000', percent: 1.6 },
  { rank: 9, address: '0x0d...9e27', amount: '33,200,000', percent: 1.3 },
  { rank: 10, address: '0x4c...6a95', amount: '28,900,000', percent: 1.1 },
];

export const TOP_HOLDERS_TOTAL_COUNT = 50;

// ------------------------------------------------------------
// MyPositionBox：底部第三块位置暂定放「我的仓位」，展示当前用户在
// 这个代币里的持仓情况，方便快速加仓/减仓。若后续想放别的内容
// （比如"代币安全检测详情" / "价格提醒设置" / "相关代币推荐" /
// "社区讨论区"），把这个 mock 和组件换掉即可，布局不用动。
// ------------------------------------------------------------
export const MY_POSITION = {
  connected: true,
  amount: '425,000',
  avgCost: '$0.0000401',
  costUsd: '$17.04',
  currentValue: '$20.48',
  pnlPercent: 20.2,
};
