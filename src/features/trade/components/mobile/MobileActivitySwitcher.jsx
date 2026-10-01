import { useState } from 'react';
import Box from '@mui/material/Box';
import ActivityBox from '../activity/ActivityBox';
import HoldingsBox from '../holdings/HoldingsBox';

const TABS = [
  { key: 'activity', label: '交易记录' },
  { key: 'holdings', label: '持仓信息' },
];

// 移动端专用：K 线图下方只保留一块区域，通过 Tab 切换展示
// 「最新交易记录」或「持有人分布」，两个 Tab 复用桌面端同一份组件，
// 只是传 variant="mobile" 换成紧凑列表样式
export default function MobileActivitySwitcher() {
  const [active, setActive] = useState(TABS[0].key);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', gap: 0.5, mb: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}>
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          return (
            <Box
              key={tab.key}
              onClick={() => setActive(tab.key)}
              sx={{
                px: 1.5,
                py: 1,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                color: isActive ? 'primary.main' : 'text.secondary',
                borderBottom: '2px solid',
                borderColor: isActive ? 'primary.main' : 'transparent',
                mb: '-1px',
              }}
            >
              {tab.label}
            </Box>
          );
        })}
      </Box>

      <Box sx={{ flex: 1 }}>
        {active === 'activity' ? (
          <ActivityBox variant="mobile" title="" />
        ) : (
          <HoldingsBox variant="mobile" title="" />
        )}
      </Box>
    </Box>
  );
}
