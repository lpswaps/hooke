import Box from '@mui/material/Box';

export default function TrendArrow({
    color = '#F5C542',
    duration = 4,
    pulse = true,
}) {
    const path =
        'M 10 150 L 140 108 L 250 132 L 400 66 L 540 96 L 700 44 L 830 78 L 980 20';
    const arrow = 'M 980 20 L 952 26 M 980 20 L 972 46';
    const PATH_LEN = 1600;
    const DRAW_RATIO = 55;

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                filter: `drop-shadow(0 0 5px ${color}) drop-shadow(0 0 16px ${color}88)`,
            }}
        >
            <svg
                viewBox="0 0 1000 180"
                width="100%"
                height="100%"
                fill="none"
                preserveAspectRatio="none"
            >
                <defs>
                    <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="5" />
                    </filter>

                    {/* 左端透明 → 右端全亮 */}
                    <linearGradient id="heroLineFade" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={color} stopOpacity="0" />
                        <stop offset="18%" stopColor={color} stopOpacity="0" />
                        <stop offset="32%" stopColor={color} stopOpacity="0.35" />
                        <stop offset="45%" stopColor={color} stopOpacity="1" />
                        <stop offset="100%" stopColor={color} stopOpacity="1" />
                    </linearGradient>
                </defs>

                {/* 底层模糊光晕 */}
                <path
                    d={path}
                    stroke="url(#heroLineFade)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.32"
                    filter="url(#heroGlow)"
                />

                {/* 主折线 */}
                <path
                    d={path}
                    stroke="url(#heroLineFade)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        strokeDasharray: PATH_LEN,
                        strokeDashoffset: PATH_LEN,
                        animation: `heroDrawLine ${duration}s ease-in-out infinite`,
                    }}
                />

                {/* 箭头（在右侧，始终全亮，不需要渐变） */}
                <path
                    d={arrow}
                    stroke={color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        opacity: 0,
                        animation: `heroArrowFade ${duration}s ease-in-out infinite`,
                    }}
                />

                {/* 末端脉冲光点 */}
                <circle cx="980" cy="20" r="3" fill={color}>
                    {pulse && (
                        <>
                            <animate attributeName="r" values="3;6;3" dur="1.8s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
                        </>
                    )}
                </circle>
            </svg>

            <style>{`
        @keyframes heroDrawLine {
          0%              { stroke-dashoffset: ${PATH_LEN}; }
          ${DRAW_RATIO}%  { stroke-dashoffset: 0; }
          100%            { stroke-dashoffset: 0; }
        }
        @keyframes heroArrowFade {
          0%, ${DRAW_RATIO - 5}% { opacity: 0; }
          ${DRAW_RATIO + 5}%     { opacity: 1; }
          99%                    { opacity: 1; }
          100%                   { opacity: 0; }
        }
      `}</style>
        </Box>
    );
}