import type { SxProps, Theme } from '@mui/material';

export const root = (overdue: boolean, completed: boolean): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1.5,
  paddingInline: 1.75,
  paddingBlock: 1.5,
  borderRadius: '14px',
  backgroundColor: 'background.paper',
  border: '1px solid',
  borderColor: overdue ? 'error.light' : 'divider',
  position: 'relative',
  cursor: 'pointer',
  transition: 'transform 160ms ease, border-color 160ms ease, background-color 160ms ease',
  opacity: completed ? 0.6 : 1,
  '&:hover': {
    transform: 'translateY(-1px)',
    borderColor: completed ? 'divider' : 'primary.light',
    backgroundColor: (t) => (t.palette.mode === 'dark' ? 'surface.raised' : 'background.paper'),
    boxShadow: '0 8px 24px -16px rgba(99,102,241,0.35)',
  },
});

export const checkbox = (completed: boolean, color: string): SxProps<Theme> => ({
  width: 22,
  height: 22,
  marginTop: 0.25,
  borderRadius: '50%',
  flexShrink: 0,
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
  border: `2px solid ${completed ? color : '#cbd5e1'}`,
  backgroundColor: completed ? color : 'transparent',
  transition: 'all 200ms ease',
  '& svg': { color: 'white', fontSize: 14, opacity: completed ? 1 : 0 },
  '&:hover': { borderColor: color },
});

export const title = (completed: boolean): SxProps<Theme> => ({
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 600,
  fontSize: 15,
  lineHeight: 1.35,
  letterSpacing: '-0.01em',
  textDecoration: completed ? 'line-through' : 'none',
  color: completed ? 'text.disabled' : 'text.primary',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

export const meta: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  marginTop: 0.75,
  flexWrap: 'wrap',
};

export const dueChip = (overdue: boolean): SxProps<Theme> => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  fontFamily: '"JetBrains Mono"',
  fontSize: 11.5,
  fontWeight: 500,
  color: overdue ? 'error.main' : 'text.secondary',
  '& svg': { fontSize: 13 },
});

export const categoryChip = (color: string): SxProps<Theme> => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  paddingInline: 0.75,
  paddingBlock: 0.25,
  borderRadius: '999px',
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 600,
  fontSize: 11,
  backgroundColor: `${color}1a`,
  color,
  border: `1px solid ${color}33`,
});
