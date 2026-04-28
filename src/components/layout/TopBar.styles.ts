import type { SxProps, Theme } from '@mui/material';

export const root: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  paddingInline: { xs: 2, sm: 3, md: 5 },
  paddingBlock: { xs: 1.5, md: 2 },
  position: 'sticky',
  top: 0,
  zIndex: 4,
  backdropFilter: 'saturate(180%) blur(14px)',
  backgroundColor: (t) => t.palette.mode === 'dark' ? 'rgba(11,11,20,0.72)' : 'rgba(250,250,251,0.72)',
  borderBottom: '1px solid',
  borderColor: 'divider',
};

export const greeting: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 700,
  fontSize: { xs: 16, md: 18 },
  letterSpacing: '-0.02em',
  flex: 1,
  minWidth: 0,
};

export const date: SxProps<Theme> = {
  fontFamily: '"JetBrains Mono"',
  fontSize: 11,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'text.secondary',
  display: { xs: 'none', sm: 'block' },
};

export const search: SxProps<Theme> = {
  display: { xs: 'none', md: 'flex' },
  alignItems: 'center',
  gap: 1,
  width: 240,
  height: 38,
  paddingInline: 1.5,
  borderRadius: '11px',
  backgroundColor: 'surface.soft',
  border: '1px solid',
  borderColor: 'divider',
  cursor: 'text',
  color: 'text.secondary',
  fontSize: 13,
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 500,
  '& kbd': {
    marginLeft: 'auto',
    fontFamily: '"JetBrains Mono"',
    fontSize: 11,
    paddingInline: 0.75,
    paddingBlock: 0.25,
    borderRadius: '6px',
    backgroundColor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
  },
};
