import Box from '@mui/material/Box';
import HeroBanner from '../features/home/HeroBanner';
import TokenListTable from '../features/home/TokenListTable';
import GraduatedCard from '../features/home/sidebar/GraduatedCard';
import LiveActivityCard from '../features/home/sidebar/liveActivity';


// =====================================================
// 布局常量（页面尺寸、断点、间距）
// =====================================================
export const CONTENT_WIDTH = 1600;
export const MAIN_WIDTH = 1100;
export const SIDEBAR_WIDTH = 490;
export const GAP = 10;

// 断点：与 MUI 默认断点对齐，避免和 sx 语法冲突
// - wide:   ≥1600px 标准桌面，Main + Sidebar 左右并排
// - medium: 900 ~ 1599px，Main 独占一行，Sidebar 2×2
// - narrow: <900px，Sidebar 1 列
const BREAKPOINTS = {
    wide: 1600,
    medium: 900,
};

// =====================================================
// 页面主网格：根据屏幕宽度切换「左右两栏 / 上下堆叠」
// =====================================================
const pageGridSx = {
    width: CONTENT_WIDTH,
    maxWidth: '100%',
    display: 'grid',
    boxSizing: 'border-box',
    py: 2,

    // 默认（≥1600px）：Main + Sidebar 左右并排
    gridTemplateColumns: `${MAIN_WIDTH}px ${SIDEBAR_WIDTH}px`,
    gap: `${GAP}px`,
    alignItems: 'start',

    // <1600px：Main 独占一行，Sidebar 移到下方
    [`@media (max-width: ${BREAKPOINTS.wide - 1}px)`]: {
        width: '100%',
        gridTemplateColumns: 'minmax(0, 1fr)',
        px: 1,
        py: 1,
        rowGap: `${GAP}px`,
    },

    // <900px：窄屏（移动端）只保留内边距
    [`@media (max-width: ${BREAKPOINTS.medium - 1}px)`]: {
        px: 1,
        py: 1,
    },
};

// =====================================================
// Main 区：Hero + TokenList，垂直堆叠
// =====================================================
const mainSx = {
    width: '100%',
    minWidth: 0,
    bgcolor: 'background.default',
    display: 'flex',
    flexDirection: 'column',
    gap: `${GAP}px`,
};

// =====================================================
// Sidebar 区：宽屏 1 列，中屏 2×2，窄屏 1 列
// =====================================================
const sidebarSx = {
    width: '100%',
    minWidth: 0,
    display: 'grid',
    gap: `${GAP}px`,

    // 默认（<1600px，中屏）：2×2
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',

    // ≥1600px：Sidebar 宽度 490px，1 列更合适
    [`@media (min-width: ${BREAKPOINTS.wide}px)`]: {
        gridTemplateColumns: '1fr',
        gap: 0,
    },

    // <900px：1 列
    [`@media (max-width: ${BREAKPOINTS.medium - 1}px)`]: {
        gridTemplateColumns: '1fr',
    },
};

export default function HomePage() {
    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Box sx={pageGridSx}>
                {/* ================= Main ================= */}
                <Box sx={mainSx}>
                    <HeroBanner />
                    <TokenListTable />
                </Box>

                {/* ================= Sidebar ================= */}
                <Box sx={sidebarSx}>
                    <GraduatedCard />
                    <LiveActivityCard />
                </Box>
            </Box>
        </Box>
    );
}