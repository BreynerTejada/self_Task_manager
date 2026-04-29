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

export const titleStack: SxProps<Theme> = {
  flex: 1,
  minWidth: 240,
  display: 'flex',
  flexDirection: 'column',
  gap: 0.5,
};

export const eyebrow: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'primary.main',
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
  minWidth: 220,
  flex: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'background.paper',
  },
};

export const statRow: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
  gap: 2,
};

export const statCard = (accent: string): SxProps<Theme> => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: 0.5,
  paddingInline: 2.5,
  paddingBlock: 2.25,
  borderRadius: '18px',
  backgroundColor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: `radial-gradient(220px 140px at 0% 0%, ${accent}22, transparent 70%)`,
    pointerEvents: 'none',
  },
});

export const statIcon = (accent: string): SxProps<Theme> => ({
  width: 36,
  height: 36,
  borderRadius: '10px',
  display: 'grid',
  placeItems: 'center',
  backgroundColor: `${accent}1f`,
  color: accent,
  marginBottom: 0.75,
  '& svg': { fontSize: 20 },
});

export const statValue: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 800,
  fontSize: 28,
  letterSpacing: '-0.025em',
  lineHeight: 1.05,
};

export const statLabel: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'text.disabled',
};

export const sectionDivider: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 1,
};

export const sectionTitle: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 700,
  fontSize: 16,
  letterSpacing: '-0.01em',
};

export const grid: SxProps<Theme> = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    lg: 'repeat(3, 1fr)',
    xl: 'repeat(4, 1fr)',
  },
};

export const sortGroup: SxProps<Theme> = {
  display: 'flex',
  gap: 0.5,
  padding: 0.5,
  borderRadius: '12px',
  backgroundColor: 'surface.soft',
  border: '1px solid',
  borderColor: 'divider',
};

export const sortChip = (active: boolean): SxProps<Theme> => ({
  paddingInline: 1.25,
  paddingBlock: 0.6,
  borderRadius: '8px',
  fontFamily: '"Plus Jakarta Sans"',
  fontSize: 12.5,
  fontWeight: 600,
  cursor: 'pointer',
  color: active ? 'primary.main' : 'text.secondary',
  backgroundColor: active ? 'background.paper' : 'transparent',
  boxShadow: active ? '0 1px 2px rgba(15,23,42,0.08)' : 'none',
  border: '1px solid',
  borderColor: active ? 'divider' : 'transparent',
  transition: 'background-color 140ms ease, color 140ms ease',
  '&:hover': { color: 'text.primary' },
});
