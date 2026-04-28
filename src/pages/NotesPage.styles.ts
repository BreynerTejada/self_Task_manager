import type { SxProps, Theme } from '@mui/material';

export const root: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export const header: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-end',
  gap: 2,
  flexWrap: 'wrap',
};

export const title: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 800,
  fontSize: { xs: 28, md: 36 },
  letterSpacing: '-0.03em',
  lineHeight: 1.05,
};

export const subtitle: SxProps<Theme> = {
  color: 'text.secondary',
  fontSize: 14,
};

export const toolbar: SxProps<Theme> = {
  display: 'flex',
  gap: 1.5,
  alignItems: 'center',
  flexWrap: 'wrap',
};

export const search: SxProps<Theme> = {
  flex: 1,
  minWidth: 240,
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'background.paper',
  },
};

export const grid: SxProps<Theme> = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    md: 'repeat(3, 1fr)',
    xl: 'repeat(4, 1fr)',
  },
};

export const card = (color: string, isPinned: boolean): SxProps<Theme> => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  padding: 2.25,
  paddingBottom: 5.5,
  borderRadius: '18px',
  minHeight: 180,
  backgroundColor: color,
  color: '#1f2937',
  border: '1px solid',
  borderColor: isPinned ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.06)',
  boxShadow: isPinned
    ? '0 14px 30px -12px rgba(0,0,0,0.18)'
    : '0 4px 12px -8px rgba(0,0,0,0.18)',
  transition: 'transform 180ms ease, box-shadow 180ms ease',
  cursor: 'text',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 18px 36px -16px rgba(0,0,0,0.22)',
  },
  '&:hover .note-actions': {
    opacity: 1,
  },
});

export const titleInput: SxProps<Theme> = {
  '& .MuiInputBase-root': {
    fontFamily: '"Plus Jakarta Sans"',
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: '-0.01em',
    color: 'inherit',
    padding: 0,
  },
  '& .MuiInputBase-input::placeholder': { color: 'rgba(31,41,55,0.55)' },
};

export const bodyInput: SxProps<Theme> = {
  flex: 1,
  '& .MuiInputBase-root': {
    fontSize: 14,
    lineHeight: 1.55,
    color: 'inherit',
    padding: 0,
    alignItems: 'flex-start',
  },
  '& .MuiInputBase-input::placeholder': { color: 'rgba(31,41,55,0.55)' },
};

export const cardFooter: SxProps<Theme> = {
  position: 'absolute',
  left: 14,
  right: 14,
  bottom: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 11,
  color: 'rgba(31,41,55,0.65)',
};

export const cardActions: SxProps<Theme> = {
  display: 'flex',
  gap: 0.25,
  opacity: 0,
  transition: 'opacity 160ms ease',
  '& .MuiIconButton-root': {
    color: 'rgba(31,41,55,0.7)',
    '&:hover': { color: '#1f2937', backgroundColor: 'rgba(0,0,0,0.06)' },
  },
};

export const colorRow: SxProps<Theme> = {
  display: 'flex',
  gap: 0.5,
  alignItems: 'center',
};

export const colorSwatch = (color: string, active: boolean): SxProps<Theme> => ({
  width: 16,
  height: 16,
  borderRadius: '50%',
  backgroundColor: color,
  cursor: 'pointer',
  border: active ? '2px solid #1f2937' : '1px solid rgba(0,0,0,0.15)',
  transition: 'transform 120ms ease',
  '&:hover': { transform: 'scale(1.15)' },
});

export const pinnedBadge: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  fontWeight: 600,
  fontSize: 11,
};
