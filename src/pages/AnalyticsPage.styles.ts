import type { SxProps, Theme } from '@mui/material';

export const statRow: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
  gap: 2,
};

export const chartGrid: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', lg: '1.4fr 1fr' },
  gap: 3,
};

export const chartCard: SxProps<Theme> = {
  paddingInline: { xs: 2.5, md: 3.5 },
  paddingBlock: { xs: 3, md: 3.5 },
  borderRadius: '20px',
  backgroundColor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
};

export const chartLabel: SxProps<Theme> = {
  color: 'primary.main',
  fontWeight: 700,
  letterSpacing: '0.16em',
};

export const statBig = (accent: string): SxProps<Theme> => ({
  paddingInline: 2.5,
  paddingBlock: 2.5,
  borderRadius: '18px',
  backgroundColor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: `radial-gradient(180px 120px at 0% 0%, ${accent}1f, transparent 70%)`,
    pointerEvents: 'none',
  },
});

export const statIcon = (accent: string): SxProps<Theme> => ({
  width: 48,
  height: 48,
  borderRadius: '14px',
  display: 'grid',
  placeItems: 'center',
  backgroundColor: `${accent}1a`,
  color: accent,
  '& svg': { fontSize: 26 },
  flexShrink: 0,
  position: 'relative',
});

export const statBigLabel: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'text.secondary',
};

export const statBigValue: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 800,
  fontSize: 32,
  letterSpacing: '-0.03em',
  lineHeight: 1.1,
};

export const statBigSuffix: SxProps<Theme> = {
  fontSize: 14,
  fontWeight: 500,
  color: 'text.secondary',
  letterSpacing: 0,
};
