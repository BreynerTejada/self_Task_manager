import type { SxProps, Theme } from '@mui/material';

export const hero: SxProps<Theme> = {
  position: 'relative',
  borderRadius: '24px',
  overflow: 'hidden',
  paddingInline: { xs: 3, md: 5 },
  paddingBlock: { xs: 3.5, md: 5 },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 3,
  flexWrap: 'wrap',
  minHeight: 220,
  background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 38%, #8b5cf6 75%, #6366f1 100%)',
  color: 'white',
  boxShadow: '0 28px 80px -32px rgba(99,102,241,0.55)',
};

export const heroBackground: SxProps<Theme> = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  backgroundImage:
    'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.18), transparent 50%), ' +
    'radial-gradient(circle at 0% 100%, rgba(255,255,255,0.08), transparent 60%), ' +
    'url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27 viewBox=%270 0 160 160%27><g fill=%27%23ffffff%27 fill-opacity=%270.04%27><circle cx=%2780%27 cy=%2780%27 r=%271%27/></g></svg>")',
};

export const heroContent: SxProps<Theme> = {
  position: 'relative',
  flex: 1,
  minWidth: 280,
};

export const heroTitle: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 800,
  fontSize: { xs: 28, md: 40 },
  letterSpacing: '-0.035em',
  lineHeight: 1.05,
  color: 'white',
  maxWidth: 540,
};

export const heroSubtitle: SxProps<Theme> = {
  color: 'rgba(255,255,255,0.85)',
  fontSize: 15,
  maxWidth: 480,
};

export const heroBtnFilled: SxProps<Theme> = {
  backgroundColor: 'white',
  color: 'primary.main',
  fontWeight: 700,
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.92)' },
};

export const heroBtnGhost: SxProps<Theme> = {
  color: 'white',
  fontWeight: 600,
  border: '1px solid rgba(255,255,255,0.4)',
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.7)' },
};

export const heroRing: SxProps<Theme> = {
  position: 'relative',
  width: 156,
  height: 156,
  flexShrink: 0,
  display: 'grid',
  placeItems: 'center',
  color: 'white',
  filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.25))',
  '& .MuiTypography-root': { color: 'white' },
};

export const statGrid: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
  gap: 2,
};

export const statCard = (accent: string): SxProps<Theme> => ({
  position: 'relative',
  paddingInline: 2.5,
  paddingBlock: 2.25,
  borderRadius: '18px',
  backgroundColor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  overflow: 'hidden',
  transition: 'transform 200ms ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    borderColor: accent,
  },
});

export const statLabel: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'text.disabled',
  marginBottom: 0.75,
};

export const statValue: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 800,
  fontSize: 36,
  letterSpacing: '-0.03em',
  lineHeight: 1.1,
};

export const statSubtitle: SxProps<Theme> = {
  fontSize: 12,
  color: 'text.secondary',
  marginTop: 0.5,
};

export const statAccent = (accent: string): SxProps<Theme> => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: 3,
  background: `linear-gradient(90deg, ${accent}, ${accent}55)`,
});

export const section: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
  paddingInline: { xs: 2.5, md: 3 },
  paddingBlock: { xs: 2.5, md: 3 },
  borderRadius: '20px',
  backgroundColor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
};
