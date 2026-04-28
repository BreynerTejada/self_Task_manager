import type { SxProps, Theme } from '@mui/material';

export const paper: SxProps<Theme> = {
  borderRadius: '20px',
  overflow: 'hidden',
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: '0 32px 80px -16px rgba(15,23,42,0.45)',
  background: (t) =>
    t.palette.mode === 'dark'
      ? 'linear-gradient(180deg, #161624 0%, #13131f 100%)'
      : 'linear-gradient(180deg, #ffffff 0%, #fafafb 100%)',
};

export const headerRow: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  paddingInline: 3,
  paddingTop: 2.5,
  paddingBottom: 1,
};

export const title: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 700,
  fontSize: 18,
  letterSpacing: '-0.02em',
  flex: 1,
};

export const subtitle: SxProps<Theme> = {
  fontFamily: '"JetBrains Mono"',
  fontSize: 11,
  color: 'text.secondary',
  letterSpacing: '0.04em',
};

export const closeBtn: SxProps<Theme> = {
  width: 30,
  height: 30,
  borderRadius: '8px',
  border: '1px solid',
  borderColor: 'divider',
  background: 'transparent',
  cursor: 'pointer',
  display: 'grid',
  placeItems: 'center',
  color: 'text.secondary',
  '&:hover': { backgroundColor: 'action.hover' },
};

export const body: SxProps<Theme> = {
  paddingInline: 3,
  paddingBlock: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export const titleInput: SxProps<Theme> = {
  fontSize: 22,
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  '& input::placeholder': { color: 'text.disabled', opacity: 1 },
};

export const smallInput: SxProps<Theme> = {
  fontSize: 14,
  paddingInline: 1.5,
  paddingBlock: 1,
  borderRadius: '10px',
  backgroundColor: 'surface.soft',
  border: '1px solid',
  borderColor: 'divider',
  fontFamily: '"JetBrains Mono"',
  flex: 1,
};

export const footer: SxProps<Theme> = {
  alignItems: 'center',
  gap: 2,
  paddingInline: 3,
  paddingBlock: 2,
  borderTop: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'surface.soft',
};
