import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import FieldLabel from './FieldLabel';
import { colors } from '../../styles/theme';

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export default function LogoUploadField({ value, error, onChange }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onChange(null, '请上传图片文件（PNG / JPG / SVG）');
      return;
    }
    if (file.size > MAX_SIZE) {
      onChange(null, '图片大小请控制在 2MB 以内');
      return;
    }

    const url = URL.createObjectURL(file);
    onChange({ file, url, name: file.name }, null);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange(null, null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Box>
      <FieldLabel
        label="代币 Logo"
        required
        tip="建议使用正方形图片，分辨率不低于 256×256，支持 PNG / JPG / SVG，大小 2MB 以内"
      />

      <Box
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1.5,
          border: '1px dashed',
          borderColor: error ? 'error.main' : dragOver ? 'primary.main' : 'divider',
          borderRadius: 2.5,
          bgcolor: dragOver ? colors.accentDimmer : colors.bgElevated,
          cursor: 'pointer',
          transition: 'border-color .15s ease, background-color .15s ease',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: 52,
            height: 52,
            flexShrink: 0,
            borderRadius: '14px 14px 8px 8px',
            bgcolor: colors.bgHover,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {value?.url ? (
            <Box
              component="img"
              src={value.url}
              alt="Logo 预览"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <CloudUploadOutlinedIcon sx={{ fontSize: 22, color: colors.textTertiary }} />
          )}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            noWrap
            sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}
          >
            {value?.name || '点击或将图片拖拽到此处上传'}
          </Typography>
          <Typography sx={{ fontSize: 11.5, color: 'text.secondary', mt: 0.25 }}>
            PNG / JPG / SVG · 建议 256×256 以上 · 最大 2MB
          </Typography>
        </Box>

        {value?.url && (
          <Box
            onClick={handleRemove}
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.textTertiary,
              flexShrink: 0,
              '&:hover': { color: 'error.main', bgcolor: 'rgba(241,106,106,0.08)' },
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 16 }} />
          </Box>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </Box>

      {error && (
        <Typography sx={{ fontSize: 11, color: 'error.main', mt: 0.5 }}>{error}</Typography>
      )}
    </Box>
  );
}
