import type { SxProps, Theme } from '@mui/material';

export const root: SxProps<Theme> = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingInline: 2.5,
  paddingBlock: 6,
  gap: 4,
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: 'background.default',
};

export const aurora: SxProps<Theme> = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  background:
    'radial-gradient(900px 600px at 75% 5%, rgba(139,92,246,0.22), transparent 60%), ' +
    'radial-gradient(700px 500px at -5% 95%, rgba(99,102,241,0.18), transparent 60%)',
};

export const progress: SxProps<Theme> = {
  display: 'flex',
  gap: 1,
  position: 'relative',
};

export const progressDot = (active: boolean): SxProps<Theme> => ({
  width: 32,
  height: 6,
  borderRadius: 999,
  backgroundColor: active ? 'primary.main' : 'divider',
  transition: 'background-color 280ms ease',
});

export const card: SxProps<Theme> = {
  position: 'relative',
  zIndex: 1,
  width: '100%',
  paddingInline: { xs: 3, sm: 5 },
  paddingBlock: { xs: 4, sm: 5 },
  borderRadius: '24px',
  backgroundColor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: '0 32px 80px -16px rgba(15,23,42,0.18)',
};

export const illustration: SxProps<Theme> = {
  display: 'grid',
  placeItems: 'center',
  marginBottom: 1,
};

export const copy: SxProps<Theme> = {
  textAlign: 'center',
  color: 'text.secondary',
  maxWidth: 380,
  lineHeight: 1.6,
  marginBottom: 1,
};

export const iconPicker: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)',
  gap: 1,
  width: '100%',
};

export const iconBtn = (active: boolean): SxProps<Theme> => ({
  height: 44,
  borderRadius: '12px',
  border: '1px solid',
  borderColor: active ? 'primary.main' : 'divider',
  backgroundColor: active ? (t) => `${t.palette.primary.main}18` : 'background.paper',
  cursor: 'pointer',
  fontSize: 20,
});

export const colorSwatch = (color: string, active: boolean): SxProps<Theme> => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundColor: color,
  cursor: 'pointer',
  border: 'none',
  outline: active ? `3px solid ${color}66` : 'none',
  outlineOffset: 2,
  transition: 'transform 160ms ease',
  '&:hover': { transform: 'scale(1.08)' },
});
