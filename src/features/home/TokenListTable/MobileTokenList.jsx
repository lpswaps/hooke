import Box from '@mui/material/Box';
import MobileTokenRow from './MobileTokenRow';

// 窄屏（<600px）卡片列表容器，纯粹负责把 tokens 渲染成一行行紧凑记录
export default function MobileTokenList({ tokens, onPlaybookClick }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {tokens.map((token, index) => (
        <MobileTokenRow
          key={token.token}
          token={token}
          onPlaybookClick={onPlaybookClick}
          isLast={index === tokens.length - 1}
        />
      ))}
    </Box>
  );
}
