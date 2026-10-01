import { useState } from 'react';
import Box from '@mui/material/Box';

// demo：目前只是本地 state 在 中/EN 之间切换文案
// 后续接入真实 i18n（如 react-i18next）时，
// 把 value / onChange 换成全局语言状态即可，组件本身不用改
const LANGS = [
  { id: 'zh', label: '中' },
  { id: 'en', label: 'EN' },
];

export default function LanguageSwitch({ value, onChange }) {
  const [innerValue, setInnerValue] = useState('zh');
  const current = value ?? innerValue;

  const handleToggle = () => {
    const next = current === 'zh' ? 'en' : 'zh';
    if (onChange) {
      onChange(next);
    } else {
      setInnerValue(next);
    }
  };

  return (
    <Box
      onClick={handleToggle}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        flexShrink: 0,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        color: 'text.primary',
        fontSize: 13,
        fontWeight: 700,
        userSelect: 'none',
        transition: 'border-color 0.15s, color 0.15s',
        '&:hover': {
          borderColor: 'primary.main',
          color: 'primary.main',
        },
      }}
    >
      {LANGS.find((l) => l.id === current)?.label}
    </Box>
  );
}
