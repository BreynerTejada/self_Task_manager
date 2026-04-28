import type { SxProps, Theme } from '@mui/material';

export const paper: SxProps<Theme> = {
  borderRadius: '18px',
  overflow: 'hidden',
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: '0 24px 80px -24px rgba(15,23,42,0.35)',
};

export const input: SxProps<Theme> = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 1.25,
  paddingInline: 2,
  paddingBlock: 1.75,
  borderBottom: '1px solid',
  borderColor: 'divider',
};

export const kbd: SxProps<Theme> = {
  fontFamily: '"JetBrains Mono"',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.04em',
  paddingInline: 0.75,
  paddingBlock: 0.25,
  borderRadius: '6px',
  backgroundColor: 'surface.soft',
  border: '1px solid',
  borderColor: 'divider',
  color: 'text.secondary',
};

export const results: SxProps<Theme> = {
  maxHeight: 360,
  overflowY: 'auto',
};

export const hint: SxProps<Theme> = {
  paddingInline: 2,
  paddingBlock: 3,
  textAlign: 'center',
  color: 'text.secondary',
  fontSize: 14,
};

export const row: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  paddingInline: 2,
  paddingBlock: 1.5,
  cursor: 'pointer',
  border: 'none',
  borderRadius: 0,
  background: 'transparent',
  width: '100%',
  textAlign: 'left',
  borderBottom: '1px solid',
  borderColor: 'divider',
  '&:hover': { backgroundColor: 'action.hover' },
  '&:last-of-type': { borderBottom: 'none' },
};
