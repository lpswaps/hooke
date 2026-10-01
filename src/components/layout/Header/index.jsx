import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import LanguageSwitch from '../LanguageSwitch';
import ConnectWalletButton from '../ConnectWalletButton';
import { useChain } from '../../../hooks/useChain';
import { NAV_ITEMS } from './navConfig';
import MobileNavDrawer from './MobileNavDrawer';

export default function Header() {

  const { chainId, setChainId } = useChain();
  const [menuOpen, setMenuOpen] = useState(false);

  // 宽屏（md 及以上）本来就不显示汉堡按钮，抽屉也该跟着关掉——
  // 之前窄屏打开抽屉后把窗口拉宽，抽屉会一直留在页面上，就是缺了这一步
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  useEffect(() => {
    if (isDesktop && menuOpen) {
      setMenuOpen(false);
    }
  }, [isDesktop, menuOpen]);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, sm: 3 },
        boxSizing: 'border-box',
        gap: 2,
      }}
    >
      {/* ================= 左侧：Logo + 导航（导航仅宽屏显示） ================= */}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
        <Box component={NavLink} to="/" sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Box component="img" src="/hooke-logo_w320.png" alt="Hooke" sx={{ height: 32, width: 'auto' }} />
        </Box>

        <Box
          component="nav"
          sx={{
            display: { xs: 'none', md: 'flex' }, // 窄屏隐藏，收进抽屉菜单
            alignItems: 'center',
            gap: 3,
          }}
        >
          {NAV_ITEMS.map((item) => (
            <Box
              key={item.to}
              component={NavLink}
              to={item.to}
              end={item.to === '/'}
              sx={{
                textDecoration: 'none',
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: 14,
                whiteSpace: 'nowrap',
                '&.active': { color: 'primary.main' },
              }}
            >
              {item.label}
            </Box>
          ))}
        </Box>
      </Box>

      {/* ================= 右侧：宽屏显示完整控件，窄屏只留汉堡按钮 ================= */}

      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
        <LanguageSwitch />
        <ConnectWalletButton />
      </Box>

      {/* 窄屏汉堡按钮 */}
      <IconButton
        onClick={() => setMenuOpen(true)}
        sx={{
          display: { xs: 'inline-flex', md: 'none' },
          color: 'text.primary',
          flexShrink: 0,
        }}
        aria-label="打开菜单"
      >
        <MenuIcon />
      </IconButton>

      {/* ================= 窄屏：从底部弹出的抽屉菜单 ================= */}

      <MobileNavDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        chainId={chainId}
        onChainChange={setChainId}

      />
    </Box>
  );
}
