import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import { NavLink } from 'react-router-dom';
import LanguageSwitch from '../LanguageSwitch';

import ConnectWalletButton from '../ConnectWalletButton';
import { NAV_ITEMS } from './navConfig';

// 窄屏底部抽屉：导航 + 语言/链切换 + 连接钱包
// 视觉上统一走"方块"风格——导航是一组等大的方形格子，
// 语言/链/钱包也都用同样的方角边框，跟桌面端的圆角控件呼应但更规整
export default function MobileNavDrawer({
  open,
  onClose,
  chainId,
  onChainChange,
  connected,
  address,
  onToggleConnect,
}) {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          bgcolor: 'background.default',
          backgroundImage: 'none',
        },
      }}
    >
      {/* 顶部：拖拽提示条 + 标题 + 关闭按钮 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          pt: 1.5,
          pb: 1,
        }}
      >
        <Box sx={{ width: 32 }} />
        <Box
          sx={{
            width: 36,
            height: 4,
            borderRadius: 2,
            bgcolor: 'divider',
            position: 'absolute',
            left: '50%',
            top: 8,
            transform: 'translateX(-50%)',
          }}
        />
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'text.secondary',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
          aria-label="关闭菜单"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* 导航：2 x 2 等大方格，每格图标 + 文字，选中态高亮边框 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1,
          px: 2,
          pb: 2,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Box
              key={item.to}
              component={NavLink}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              sx={{
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                height: 76,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.secondary',
                bgcolor: 'background.paper',
                '&.active': {
                  color: 'primary.main',
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(163,230,53,0.08)',
                },
              }}
            >
              <Icon sx={{ fontSize: 22 }} />
              <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'inherit' }}>
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ borderColor: 'divider' }} />

      {/* 语言 + 选链，各占一半宽度的方形控件行 */}
      <Box sx={{ display: 'flex', gap: 1, px: 2, py: 2 }}>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 1.5,
            height: 44,
            borderRadius: 1,

            borderColor: 'divider',
          }}
        >

          <LanguageSwitch />
          <ConnectWalletButton
            connected={connected}
            address={address}
            onClick={onToggleConnect}
            fullWidth
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 1.5,
            height: 44,
            borderRadius: 1,

            borderColor: 'divider',
          }}
        >

        </Box>
      </Box>


    </Drawer>
  );
}
