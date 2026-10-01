import Box from '@mui/material/Box';

/**
 * 通用数据标签：左边图标 + 右边文字
 *
 * @param {ReactNode} icon        - 左侧图标（传 MUI 图标组件，如 <SellIcon />）
 * @param {ReactNode} children    - 右侧内容
 * @param {string}    bgcolor     - 背景色（默认透明）
 * @param {string}    color       - 字体颜色（默认 text.secondary）
 * @param {string}    borderColor - 边框颜色（默认 divider）
 * @param {function}  onClick     - 点击回调（可选）
 */
export default function DataTag({
    icon,
    children,
    bgcolor = 'transparent',
    color = 'text.secondary',
    borderColor = 'divider',
    onClick,
}) {
    return (
        <Box
            onClick={onClick}
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                height: 20,
                px: 0.75,
                borderRadius: '4px',
                border: '1px solid',
                borderColor,
                bgcolor,
                color,
                fontSize: 11,
                lineHeight: 1,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'opacity 0.15s',
                '&:hover': onClick ? { opacity: 0.8 } : undefined,

                // 统一图标大小，避免每个图标单独写 sx
                '& svg': {
                    fontSize: 12,
                },
            }}
        >
            {icon}
            {children}
        </Box>
    );
}