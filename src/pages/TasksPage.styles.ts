import type { SxProps, Theme } from '@mui/material';

export const layout: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: 3,
  alignItems: 'flex-start',
};

export const list: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
};
