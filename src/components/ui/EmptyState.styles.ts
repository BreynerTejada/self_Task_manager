import type { SxProps, Theme } from '@mui/material';

export const root: SxProps<Theme> = {
  paddingBlock: { xs: 5, md: 8 },
  paddingInline: 3,
  alignItems: 'center',
  textAlign: 'center',
  gap: 1.5,
};

export const illustration: SxProps<Theme> = {
  display: 'grid',
  placeItems: 'center',
  marginBottom: 1,
  opacity: (t) => (t.palette.mode === 'dark' ? 0.85 : 1),
  filter: (t) => (t.palette.mode === 'dark' ? 'hue-rotate(2deg) saturate(0.9) brightness(0.95)' : 'none'),
};

export const title: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 700,
  letterSpacing: '-0.02em',
};

export const description: SxProps<Theme> = {
  color: 'text.secondary',
  maxWidth: 380,
  lineHeight: 1.55,
};
