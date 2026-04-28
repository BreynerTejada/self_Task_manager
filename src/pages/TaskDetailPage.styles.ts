import type { SxProps, Theme } from '@mui/material';

export const root: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  maxWidth: 920,
  marginInline: 'auto',
};

export const header = (accent: string): SxProps<Theme> => ({
  position: 'relative',
  paddingInline: { xs: 3, md: 4 },
  paddingBlock: { xs: 3, md: 4 },
  borderRadius: '20px',
  background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 70%, ${accent}aa 100%)`,
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5,
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 90% 0%, rgba(255,255,255,0.18), transparent 50%)',
    pointerEvents: 'none',
  },
});

export const headerTitle: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 800,
  fontSize: { xs: 26, md: 36 },
  letterSpacing: '-0.03em',
  lineHeight: 1.1,
  color: 'white',
};

export const headerSubtitle: SxProps<Theme> = {
  color: 'rgba(255,255,255,0.85)',
  fontSize: 14,
};

export const headerBtn: SxProps<Theme> = {
  backgroundColor: 'white',
  color: 'text.primary',
  fontWeight: 700,
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.92)' },
};

export const headerBtnGhost: SxProps<Theme> = {
  color: 'white',
  borderColor: 'rgba(255,255,255,0.4)',
  fontWeight: 600,
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.7)' },
};

export const metaGrid: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
  gap: 2,
};

export const metaCard: SxProps<Theme> = {
  paddingInline: 2,
  paddingBlock: 2,
  borderRadius: '14px',
  border: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'background.paper',
};

export const descriptionCard: SxProps<Theme> = {
  paddingInline: { xs: 3, md: 4 },
  paddingBlock: { xs: 3, md: 4 },
  borderRadius: '20px',
  border: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'background.paper',
};
