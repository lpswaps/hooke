import Box from '@mui/material/Box';
import { colors } from '../../styles/theme';

// Hooke 品牌吉祥物是一只方块像素风格的青蛙：
// 头顶两只方形眼睛 + 两侧探出的手臂 + 底部一对阶梯状的脚掌。
// 这里把「创建 Token」的卡片本身设计成青蛙的样子：
// 卡片 = 青蛙身体，顶部两只像素眼睛，两侧露出的手臂色块，底部两只脚掌把卡片"踩"在页面上。
const FROG_GOLD = '#E3B23C';

export default function FrogFrame({ children, sx }) {
  return (
    <Box sx={{ position: 'relative', width: '100%', pt: 2, pb: 2.5, ...sx }}>
      {/* 眼睛 */}
      <FrogEye sx={{ left: '15%' }} />
      <FrogEye sx={{ right: '15%', left: 'auto' }} />

      {/* 手臂 */}
      <FrogArm side="left" />
      <FrogArm side="right" />

      {/* 卡片主体 = 青蛙身体 */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: colors.accent,
          borderRadius: '30px 30px 22px 22px',

        }}
      >
        {children}
      </Box>

      {/* 脚掌 */}
      <FrogFoot side="left" />
      <FrogFoot side="right" />
    </Box>
  );
}

function FrogEye({ sx }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 4,
        width: 30,
        height: 30,
        zIndex: 1,
        bgcolor: colors.accent,
        border: '1px solid rgba(0,0,0,0.35)',
        borderRadius: '7px 7px 3px 3px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 14px ${colors.accentDim}`,
        ...sx,
      }}
    >
      <Box sx={{ width: 9, height: 15, bgcolor: '#0A0B08', borderRadius: '2px' }} />
    </Box>
  );
}

function FrogArm({ side }) {
  const isLeft = side === 'left';
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 58,
        [isLeft ? 'left' : 'right']: -10,
        width: 20,
        height: 32,
        zIndex: 1,
        bgcolor: FROG_GOLD,
        opacity: 0.9,
        borderRadius: 3,
        display: { xs: 'none', sm: 'block' },
        clipPath: isLeft
          ? 'polygon(100% 0%, 100% 100%, 25% 100%, 0% 35%, 45% 0%)'
          : 'polygon(0% 0%, 0% 100%, 75% 100%, 100% 35%, 55% 0%)',
      }}
    />
  );
}

function FrogFoot({ side }) {
  const isLeft = side === 'left';
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 6,
        [isLeft ? 'left' : 'right']: '7%',
        width: 44,
        height: 20,
        zIndex: 1,
        bgcolor: FROG_GOLD,
        opacity: 0.85,
        clipPath: isLeft
          ? 'polygon(0% 45%, 32% 45%, 32% 0%, 62% 0%, 62% 45%, 100% 45%, 100% 100%, 0% 100%)'
          : 'polygon(0% 45%, 38% 45%, 38% 0%, 68% 0%, 68% 45%, 100% 45%, 100% 100%, 0% 100%)',
      }}
    />
  );
}
