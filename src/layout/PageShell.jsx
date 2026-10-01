import Box from '@mui/material/Box';

export const HEADER_HEIGHT = 60;

// PageShell 只负责「壳」：
// 顶部 Header + 背景网格纹理
// 具体每个页面的内容（首页 / 市场 / 排行榜 / 我的 / 创建代币）
// 都通过 children 传入，各自管理自己的宽度和响应式布局
export default function PageShell({
    header,
    children,
}) {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
                backgroundImage: `
          linear-gradient(
            rgba(113, 160, 92, 0.06) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(113, 160, 92, 0.06) 1px,
            transparent 1px
          )
        `,
                backgroundSize: '40px 40px',
            }}
        >
            {/* ================= Header ================= */}

            <Box
                component="header"
                sx={{
                    width: '100%',
                    height: HEADER_HEIGHT,
                    boxSizing: 'border-box',
                    borderBottom: '2px solid rgba(113, 160, 92, 0.06)',
                    bgcolor: 'background.default',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                }}
            >
                {header}
            </Box>

            {/* ================= Page Content ================= */}

            <Box component="main" sx={{ width: '100%' }}>
                {children}
            </Box>
        </Box>
    );
}
