import Box from '@mui/material/Box';

export default function CommonBox({
    children,

    // 尺寸
    width = '100%',
    height,
    minHeight,

    // 间距
    p,
    px,
    py,
    m,
    mx,
    my,

    // 样式
    bgcolor = 'transparent',
    border = true,
    borderColor = 'divider',
    borderRadius = 1,

    // 其他 MUI sx
    sx,

    ...props
}) {
    return (
        <Box
            sx={{
                width,
                height,
                minHeight,

                p,
                px,
                py,
                m,
                mx,
                my,

                bgcolor,

                border: border ? '1px solid' : 'none',
                borderColor: border ? borderColor : 'transparent',
                borderRadius,

                boxSizing: 'border-box',

                ...sx,
            }}
            {...props}
        >
            {children}
        </Box>
    );
}