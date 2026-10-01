import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import SearchIcon from '@mui/icons-material/Search';
import { TOKEN_TABS } from '../../../features/home/mock/homeMockData';
import DesktopTokenTable from './DesktopTokenTable';
import MobileTokenList from './MobileTokenList';
import { useTokenList } from '../../../hooks/useTokenList';

export default function TokenListTable({ onPlaybookClick, onSearchClick }) {
  const [category, setCategory] = useState(TOKEN_TABS[0].key);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: tokenList, isLoading, error } = useTokenList(category, {
    search,
    page,
    pageSize: 12,
  });

  // 切换分类或搜索时重置页码
  useEffect(() => {
    setPage(1);
  }, [category, search]);

  const handleCategoryChange = (key) => {
    setCategory(key);
  };

  const handlePlaybookClick = (token) => {
    if (onPlaybookClick) {
      onPlaybookClick(token);
    } else {
      console.log('[Playbook] clicked:', token.symbol, token.playbook);
    }
  };

  const total = tokenList?.pagination?.total ?? 0;
  const totalPages = tokenList?.pagination?.totalPages ?? 0;
  const tokens = tokenList?.data ?? [];

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {/* ================= 筛选栏 ================= */}
      <Box
        sx={{
          width: '100%',
          minHeight: 50,
          borderRadius: 1,
          boxSizing: 'border-box',
          bgcolor: 'background.default',
          px: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          flexWrap: 'wrap',
          py: { xs: 1, sm: 0 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            overflowX: 'auto',
            flex: 1,
            minWidth: 0,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {TOKEN_TABS.map((tab) => {
            const isActive = tab.key === category;
            return (
              <Box
                key={tab.key}
                onClick={() => handleCategoryChange(tab.key)}
                sx={{
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 0.6,
                  border: '1px solid',
                  borderColor: 'primary.border',
                  fontSize: 13,
                  fontWeight: 600,
                  color: isActive ? 'primary.contrastText' : 'text.secondary',
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.main' : 'action.hover',
                    color: isActive ? 'primary.contrastText' : 'text.primary',
                  },
                }}
              >
                <span aria-hidden="true">{tab.icon}</span>
                {tab.label}
              </Box>
            );
          })}
        </Box>

        <Box
          onClick={() => onSearchClick?.()}
          sx={{
            flexShrink: 0,
            width: { xs: '100%', sm: 220 },
            height: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1.25,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            cursor: 'pointer',
            color: 'text.secondary',
            bgcolor: 'background.paper',
            transition: 'border-color 0.15s ease, color 0.15s ease',
            '&:hover': {
              borderColor: 'text.secondary',
              color: 'text.primary',
            },
          }}
        >
          <SearchIcon fontSize="small" />
          <Box
            component="span"
            sx={{
              fontSize: 13,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            输入代币地址搜索
          </Box>
        </Box>
      </Box>

      {/* ================= 列表主体 ================= */}
      <Box
        sx={{
          width: '100%',
          minHeight: 700,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.default',
          borderRadius: 1,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, flex: 1, flexDirection: 'column' }}>
          {isLoading ? (
            <Box sx={{ p: 2, color: 'text.secondary', fontSize: 13 }}>加载中...</Box>
          ) : error ? (
            <Box sx={{ p: 2, color: 'error.main', fontSize: 13 }}>
              加载失败：{error.message}
            </Box>
          ) : tokens.length ? (
            <DesktopTokenTable tokens={tokens} onPlaybookClick={handlePlaybookClick} />
          ) : (
            <Box sx={{ p: 2, color: 'text.secondary', fontSize: 13 }}>暂无数据</Box>
          )}
        </Box>

        {/* 移动端：等 MobileTokenList 接好真实数据再打开 */}
        {/* <Box sx={{ display: { xs: 'flex', sm: 'none' }, flex: 1, flexDirection: 'column' }}>
          <MobileTokenList tokens={tokens} onPlaybookClick={handlePlaybookClick} />
        </Box> */}

        {/* ================= 底部：总数 + 分页 ================= */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            px: 2,
            py: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            flexWrap: 'wrap',
          }}
        >
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
            共 {total} 个 Token
          </Typography>

          <Pagination
            page={page}
            onChange={(_, value) => setPage(value)}
            count={totalPages}
            size="small"
            shape="rounded"
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'text.secondary',
                fontSize: 12,
              },
              '& .Mui-selected': {
                bgcolor: 'primary.main !important',
                color: 'primary.contrastText',
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

