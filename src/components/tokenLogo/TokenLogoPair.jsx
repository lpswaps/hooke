import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';

const SIZE_PRESETS = {
    small: { main: 40, badge: 16, radius: 1 },
    medium: { main: 40, badge: 16, radius: 1 },
    large: { main: 40, badge: 16, radius: 1 },
};

/**
 * 代币主logo（方形圆角）+ 右下角叠加配对资产logo（圆形徽章）。
 * 如果 tokenLogoUrl 缺失，用 symbol 首字母兜底显示；quoteLogoUrl 同理。
 *
 * @param {string} tokenLogoUrl - 代币自己的logo图片地址
 * @param {string} tokenSymbol - 代币symbol，logo加载失败/缺失时用首字母兜底
 * @param {string} quoteLogoUrl - 配对资产（WBNB/USDT等）的logo图片地址
 * @param {string} quoteSymbol - 配对资产symbol，同样用于兜底
 * @param {'small'|'medium'|'large'} size - 预设尺寸
 * @param {string} tokenBgColor - 主logo兜底时的背景色（比如按symbol哈希出的颜色）
 */
export default function TokenLogoWithPair({
    tokenLogoUrl,
    tokenSymbol = '',
    quoteLogoUrl,
    quoteSymbol = '',
    size = 'medium',
    tokenBgColor,
}) {
    const { main, badge, radius } = SIZE_PRESETS[size] ?? SIZE_PRESETS.medium;

    return (
        <Box
            sx={{
                position: 'relative',
                width: main,
                height: main,
                flexShrink: 0,
            }}
        >
            {/* 主logo：方形圆角 */}
            <Avatar
                src={tokenLogoUrl || undefined}
                variant="rounded"
                sx={{
                    width: main,
                    height: main,
                    borderRadius: radius,
                    fontSize: main * 0.4,
                    fontWeight: 700,
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                {!tokenLogoUrl && tokenSymbol.charAt(0).toUpperCase()}
            </Avatar>

            {/* 配对资产角标：圆形，叠在右下角 */}
            {(quoteLogoUrl || quoteSymbol) && (
                <Tooltip title={quoteSymbol}>
                    <Avatar
                        src={quoteLogoUrl || undefined}
                        sx={{
                            position: 'absolute',
                            bottom: -badge * 0.15,
                            right: -badge * 0.15,
                            width: badge,
                            height: badge,
                            fontSize: badge * 0.5,
                            fontWeight: 700,
                            bgcolor: 'grey.700',
                            border: '2px solid',
                            borderColor: 'background.default', // 用背景色做描边，形成"挖空"的叠加效果
                        }}
                    >
                        {!quoteLogoUrl && quoteSymbol.charAt(0).toUpperCase()}
                    </Avatar>
                </Tooltip>
            )}
        </Box>
    );
}