import { createTheme } from '@mui/material/styles';

// Hooke 品牌色板
// 背景：纯黑 / 微灰黑分层，营造深度
// 主色：荧光青柠绿，用于强调、按钮、涨幅
// 辅助：珊瑚红用于跌幅，保留极少量用于状态提示
export const colors = {
    bgDefault: '#080808',
    bgPaper: '#0E1010',
    bgElevated: '#141715',
    bgHover: '#1A1D1B',
    border: 'rgba(255, 255, 255, 0.06)',
    borderStrong: 'rgba(255,255,255,0.14)',
    accent: '#e7c634',
    accentDim: 'rgba(199, 248, 76, 0.12)',
    accentDimmer: 'rgba(199, 248, 76, 0.06)',
    positive: '#8FD14F',
    negative: '#F16A6A',
    textPrimary: '#F5F6F3',
    textSecondary: '#9A9E9B',
    textTertiary: '#6B706C',
};

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: colors.bgDefault,
            paper: colors.bgPaper,
        },
        primary: {
            main: colors.accent,
            border: colors.positive,
            contrastText: '#0A0B08',
        },
        success: {
            main: colors.positive,
        },
        error: {
            main: colors.negative,
        },
        text: {
            primary: colors.textPrimary,
            secondary: colors.textSecondary,
        },
        divider: colors.border,
    },
    shape: {
        borderRadius: 10,
    },
    typography: {
        fontFamily: '"Inter", "Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        h1: { fontWeight: 700, letterSpacing: -0.5 },
        h2: { fontWeight: 700, letterSpacing: -0.5 },
        h3: { fontWeight: 700, letterSpacing: -0.3 },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: colors.bgDefault,
                    scrollbarColor: `${colors.borderStrong} transparent`,
                    '&::-webkit-scrollbar': { width: 8, height: 8 },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: colors.borderStrong,
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 600,
                },
                containedPrimary: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: `0 0 20px ${colors.accentDim}`,
                        backgroundColor: colors.accent,
                    },
                },
                outlined: {
                    borderColor: colors.border,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                },
            },
        },
    },
});

export default theme;
