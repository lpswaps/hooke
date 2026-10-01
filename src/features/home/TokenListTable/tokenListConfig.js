// 桌面表格的列定义：宽度总和 ≈ 1040px
// 移动端卡片不用这份配置（移动端字段更少、布局也不同，见 MobileTokenRow）
export const HEAD_CELLS = [
  { key: 'token', label: 'TOKEN', align: 'left', width: 160 },
  { key: 'trend', label: '24H CHART', align: 'center', width: 76 },
  { key: 'progress', label: 'ATH', align: 'center', width: 72 },
  { key: 'age', label: 'AGE', align: 'right', width: 80 },
  { key: 'marketCap', label: 'MCAP', align: 'right', width: 84 },
  { key: 'tax', label: 'B/S TAX', align: 'right', width: 80 },
  { key: 'holders', label: 'TXNS', align: 'right', width: 76 },
  { key: 'volume24h', label: '24H VOL', align: 'right', width: 88 },
  { key: 'change1h', label: '1H', align: 'right', width: 60 },
  { key: 'change12h', label: '12H', align: 'right', width: 64 },
  { key: 'change24h', label: '24H', align: 'right', width: 64 },
  { key: 'playbook', label: 'HOOK', align: 'center', width: 64 },
];

// 统一收紧的横向内边距
export const CELL_PX = 1;
