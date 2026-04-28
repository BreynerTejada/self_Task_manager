import type { SxProps, Theme } from '@mui/material';

export const card: SxProps<Theme> = {
  paddingInline: { xs: 2.5, md: 4 },
  paddingBlock: { xs: 3, md: 4 },
  borderRadius: '20px',
  backgroundColor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
};

export const colorSwatch = (color: string, active: boolean): SxProps<Theme> => ({
  width: 28,
  height: 28,
  borderRadius: '50%',
  backgroundColor: color,
  cursor: 'pointer',
  border: 'none',
  outline: active ? `3px solid ${color}66` : '1px solid transparent',
  outlineOffset: 2,
  flexShrink: 0,
});

export const catRow: SxProps<Theme> = {
  paddingInline: 1.5,
  paddingBlock: 1,
  borderRadius: '12px',
  border: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'surface.soft',
};

export const prefRow: SxProps<Theme> = {
  paddingInline: 2,
  paddingBlock: 1.75,
  borderRadius: '14px',
  border: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'surface.soft',
  flexWrap: 'wrap',
  gap: 1.5,
};
